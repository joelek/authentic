import * as libwt from "worker_threads";
import * as stores from "./stores";
import { Job, VolatileJobStore } from "./stores/job";
import { JobStatus } from "./objects";

const CODE_FROM_STATUS: Record<JobStatus, number> = {
	ENQUEUED: 0,
	RUNNING: 1,
	SUCCESS: 2,
	FAILURE: 3,
	INVALID: 4
};

const STATUS_FROM_CODE: Record<number, JobStatus> = {
	0: "ENQUEUED",
	1: "RUNNING",
	2: "SUCCESS",
	3: "FAILURE",
	4: "INVALID"
};

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

export type ScheduledJob = {
	date: Date;
	metadata?: JobMetadata;
};

export type TaskScheduler = () => ScheduledJob | undefined;

export type JobMetadata = Partial<Pick<stores.job.Job, "description" | "options" | "expires_utc">>;

export type TaskRunner = (job_id: string, options: string | null) => Promise<void>;

export type Task = {
	runner: TaskRunner;
	scheduler?: TaskScheduler;
};

export type RunnerOptions = {
	tasks?: Record<string, Task>;
	jobs?: stores.job.JobStore;
};

export class Runner {
	protected tasks: Record<string, Task>;
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

	protected async * generateScheduledJobs(scheduler: TaskScheduler): AsyncGenerator<ScheduledJob> {
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
		console.log(`Running job with type ${job.type} and id ${job.job_id}...`);
		job = await this.jobs.updateObject({
			...job,
			status: "RUNNING",
			updated_utc: Date.now(),
			started_utc: Date.now()
		});
		let status = await new Promise<JobStatus>((resolve, reject) => {
			let worker = new libwt.Worker(__filename, {
				workerData: job
			});
			worker.on("exit", (code) => {
				resolve(STATUS_FROM_CODE[code]);
			});
		});
		job = await this.jobs.updateObject({
			...job,
			status: status,
			updated_utc: Date.now(),
			ended_utc: Date.now()
		});
		console.log(`Job with type ${job.type} and id ${job.job_id} completed with status ${job.status}.`);
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
								key: "expires_utc",
								operator: "<=",
								operand: Date.now()
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

	protected async startWorker(): Promise<JobStatus> {
		if (Job.is(libwt.workerData)) {
			let job = Job.as(libwt.workerData);
			if (job.type in this.tasks) {
				try {
					await this.tasks[job.type].runner(job.job_id, job.options ?? null);
					return "SUCCESS";
				} catch (error) {
					return "FAILURE";
				}
			} else {
				return "INVALID";
			}
		}
		return "INVALID";
	}

	constructor(options?: RunnerOptions) {
		this.tasks = options?.tasks ?? {};
		this.jobs = options?.jobs ?? new VolatileJobStore();
	}

	isMainThread(): boolean {
		return libwt.isMainThread;
	}

	async enqueue(type: string, metadata?: JobMetadata): Promise<void> {
		if (this.isMainThread()) {
			let now = Date.now();
			let job = await this.jobs.createObject({
				created_utc: now,
				updated_utc: now,
				type: type,
				options: metadata?.options ?? null,
				description: metadata?.description ?? null,
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
			return this.startWorker().then((status) => {
				// Exit explicitly to close open database connections and send status.
				process.exit(CODE_FROM_STATUS[status]);
			});
		}
	}
};
