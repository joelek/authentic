import * as libwt from "worker_threads";
import * as stores from "./stores";
import { VolatileJobStore } from "./stores/job";

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
		await new Promise((resolve, reject) => {
			let worker = new libwt.Worker(__filename, {
				argv: [job.job_id]
			});
			worker.on("exit", resolve);
		});
		console.log(`Job with type ${job.type} and id ${job.job_id} completed.`);
	}

	constructor(options?: RunnerOptions) {
		this.tasks = options?.tasks ?? {};
		this.jobs = options?.jobs ?? new VolatileJobStore();
	}

	isMainThread(): boolean {
		return libwt.isMainThread;
	}

	async enqueue(type: string, metadata?: JobMetadata): Promise<string> {
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
		return job.job_id;
	}

	async start(): Promise<void> {
		if (this.isMainThread()) {
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
		} else {
			if (process.argv.length === 3) {
				let job_id = process.argv[2];
				let job = await this.jobs.lookupObject(job_id);
				if (job.status === "ENQUEUED") {
					if (job.type in this.tasks) {
						job = await this.jobs.updateObject({
							...job,
							status: "RUNNING",
							updated_utc: Date.now(),
							started_utc: Date.now()
						});
						try {
							await this.tasks[job.type].runner(job.job_id, job.options ?? null);
							job = await this.jobs.updateObject({
								...job,
								status: "SUCCESS",
								updated_utc: Date.now(),
								ended_utc: Date.now()
							});
						} catch (error) {
							job = await this.jobs.updateObject({
								...job,
								status: "FAILURE",
								updated_utc: Date.now(),
								ended_utc: Date.now()
							});
						}
					} else {
						job = await this.jobs.updateObject({
							...job,
							status: "INVALID",
							updated_utc: Date.now()
						});
					}
				}
			}
			// Exit explicitly to close open database connections.
			process.exit();
		}
	}
};
