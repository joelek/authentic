import * as autoguard from "@joelek/autoguard";
import * as libwt from "worker_threads";
import * as stores from "./stores";
import { Job, VolatileJobStore } from "./stores/job";
import { JSON } from "../shared";

function oneSecondFromNow(): Date {
	let date = new Date();
	date.setUTCSeconds(date.getUTCSeconds() + 1);
	return date;
};

function oneMinuteFromNow(): Date {
	let date = new Date();
	date.setUTCMinutes(date.getUTCMinutes() + 1);
	return date;
};

async function waitUntil(target_ms: number): Promise<void> {
	while (true) {
		let now_ms = Date.now();
		let remaining_ms = target_ms - now_ms;
		if (remaining_ms <= 0) {
			break;
		}
		let step_ms = Math.min(remaining_ms, 2147483647);
		await new Promise((resolve, reject) => {
			setTimeout(resolve, step_ms);
		});
	}
};

export type DateProvider = () => Date | undefined;

export type ScheduledJob<A extends JSON> = {
	date: Date;
	metadata: JobMetadata<A>;
};

export type TaskScheduler<A extends JSON> = () => ScheduledJob<A> | undefined;

export type JobMetadata<A extends JSON> = {
	options: A;
	expires_utc?: number | null;
};

export type TaskRunner<A extends JSON> = (job_id: string, options: A) => Promise<void>;

export type Task<A extends JSON> = {
	runner: TaskRunner<A>;
	scheduler?: TaskScheduler<A>;
	guard?: autoguard.serialization.MessageGuard<A>;
};

export type Options<A extends Options<A>> = {
	[B in keyof A]: JSON;
};

export type TasksFromOptions<A extends Options<A>> = {
	[B in keyof A]: Task<A[B]>;
};

export type RunnerOptions<A extends Options<A>> = {
	tasks: TasksFromOptions<A>;
	jobs?: stores.job.JobStore;
};

export class Runner<A extends Options<A>> {
	protected tasks: TasksFromOptions<A>;
	protected jobs: stores.job.JobStore;

	protected async * generateDates(date_provider: DateProvider): AsyncGenerator<Date> {
		while (true) {
			let date = date_provider();
			if (date == null) {
				break;
			}
			await waitUntil(date.getTime());
			yield date;
		}
	}

	protected async * generateScheduledJobs<A extends JSON>(scheduler: TaskScheduler<A>): AsyncGenerator<ScheduledJob<A>> {
		while (true) {
			let scheduled_job = scheduler();
			if (scheduled_job == null) {
				break;
			}
			await waitUntil(scheduled_job.date.getTime());
			yield scheduled_job;
		}
	}

	protected async runJob(job: stores.job.Job): Promise<void> {
		let promise = new Promise<void>(async (resolve, reject) => {
			console.log(`Running job with type ${job.type} and id ${job.job_id}...`);
			job = await this.jobs.updateObject({
				...job,
				status: "RUNNING",
				updated_utc: Date.now(),
				started_utc: Date.now()
			});
			let success = await new Promise<boolean>((resolve, reject) => {
				let worker = new libwt.Worker(__filename, {
					workerData: job
				});
				worker.on("exit", (code) => {
					resolve(code === 0);
				});
			});
			job = await this.jobs.updateObject({
				...job,
				status: success ? "SUCCESS" : "FAILURE",
				updated_utc: Date.now(),
				ended_utc: Date.now()
			});
			console.log(`Job with type ${job.type} and id ${job.job_id} completed with status ${job.status}.`);
			resolve();
		});
		let onSignal = async () => {
			await promise;
			process.exit(1);
		};
		process.on("SIGINT", onSignal);
		process.on("SIGTERM", onSignal);
		await promise;
		process.off("SIGINT", onSignal);
		process.off("SIGTERM", onSignal);
	}

	protected async startBroker(): Promise<void> {
		let promises: Array<Promise<void>> = [];
		for (let type in this.tasks) {
			let scheduler = new Promise<void>(async (resolve, reject) => {
				let scheduler = this.tasks[type].scheduler;
				if (scheduler != null) {
					for await (let scheduled_job of this.generateScheduledJobs(scheduler)) {
						let enqueued_jobs = await this.jobs.lookupObjects({
							where: {
								all: [
									{
										key: "status",
										operator: "==",
										operand: "ENQUEUED"
									},
									{
										key: "type",
										operator: "==",
										operand: type
									}
								]
							},
							length: 1
						});
						if (enqueued_jobs.length > 0) {
							continue;
						}
						let running_jobs = await this.jobs.lookupObjects({
							where: {
								all: [
									{
										key: "status",
										operator: "==",
										operand: "RUNNING"
									},
									{
										key: "type",
										operator: "==",
										operand: type
									}
								]
							},
							length: 1
						});
						if (running_jobs.length > 0) {
							continue;
						}
						await this.enqueue(type, scheduled_job.metadata);
					}
				}
				resolve();
			});
			promises.push(scheduler);
		}
		let poller = new Promise<void>(async (resolve, reject) => {
			for await (let date of this.generateDates(oneSecondFromNow)) {
				let jobs = await this.jobs.lookupObjects({
					where: {
						all: [
							{
								key: "status",
								operator: "==",
								operand: "ENQUEUED"
							},
							{
								any: [
									{
										key: "expires_utc",
										operator: "==",
										operand: null
									},
									{
										key: "expires_utc",
										operator: ">",
										operand: Date.now()
									}
								]
							}
						]
					},
					order: {
						keys: ["created_utc"],
						sort: "ASC"
					},
					length: 1
				});
				let job = jobs.pop();
				if (job == null) {
					continue;
				}
				await this.runJob(job);
			}
			resolve();
		});
		promises.push(poller);
		let cleaner = new Promise<void>(async (resolve, reject) => {
			for await (let date of this.generateDates(oneMinuteFromNow)) {
				let jobs = await this.jobs.lookupObjects({
					where: {
						all: [
							{
								key: "status",
								operator: "!=",
								operand: "RUNNING"
							},
							{
								all: [
									{
										key: "expires_utc",
										operator: "!=",
										operand: null
									},
									{
										key: "expires_utc",
										operator: "<=",
										operand: Date.now()
									}
								]
							}
						]
					}
				});
				for (let job of jobs) {
					await this.jobs.deleteObject(job.job_id).catch(() => undefined);
				}
			}
			resolve();
		});
		promises.push(cleaner);
		await Promise.all(promises);
	}

	protected async startWorker(): Promise<boolean> {
		try {
			if (!Job.is(libwt.workerData)) {
				throw new Error(`Expected worker data to contain a job!`);
			}
			let job = Job.as(libwt.workerData);
			if (!(job.type in this.tasks)) {
				throw new Error(`Expected "${job.type}" to be a known job type!`);
			}
			let task = this.tasks[job.type as keyof A];
			let options = JSON.parse(job.options);
			if (task.guard != null) {
				if (!task.guard.is(options)) {
					throw new Error(`Expected job with type "${job.type}" to be initialized with valid options!`);
				}
			}
			await task.runner(job.job_id, options);
			return true;
		} catch (error) {
			console.log(error);
		}
		return false;
	}

	constructor(options: RunnerOptions<A>) {
		this.tasks = options.tasks;
		this.jobs = options?.jobs ?? new VolatileJobStore();
	}

	isMainThread(): boolean {
		return libwt.isMainThread;
	}

	async enqueue<C extends keyof A & string>(type: C, metadata: JobMetadata<A[C]>): Promise<void> {
		if (this.isMainThread()) {
			let now = Date.now();
			let job = await this.jobs.createObject({
				created_utc: now,
				updated_utc: now,
				type: type,
				options: JSON.stringify(metadata.options),
				status: "ENQUEUED",
				started_utc: null,
				ended_utc: null,
				expires_utc: metadata?.expires_utc ?? null
			});
		}
	}

	start(): Promise<void> {
		if (this.isMainThread()) {
			return this.startBroker();
		} else {
			return this.startWorker().then((success) => {
				// Exit explicitly to close open database connections and send status.
				process.exit(success ? 0 : 1);
			});
		}
	}
};
