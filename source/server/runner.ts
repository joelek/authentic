import * as libwt from "worker_threads";
import * as stores from "./stores";

async function runJob(job: stores.job.Job): Promise<void> {
	console.log(`Running job with id ${job.job_id}...`);
	await new Promise((resolve, reject) => {
		let worker = new libwt.Worker(__filename, {
			argv: [job.job_id]
		});
		worker.on("exit", resolve);
	});
	console.log(`Job with id ${job.job_id} completed.`);
};

type DateProvider = () => Date | null;

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

async function * getScheduledDates(getNextDate: DateProvider): AsyncGenerator<Date> {
	while (true) {
		let next_date = getNextDate();
		if (next_date == null) {
			break;
		}
		await waitUntil(next_date.getTime());
		yield next_date;
	}
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

export type JobMetadata = Partial<Pick<stores.job.Job, "description" | "options" | "expires_utc">>;

export type Task = {
	run(job_id: string, options: string | null): Promise<void>;
	getNextDate(): Date | null;
	getMetadata(next_date: Date): JobMetadata;
};

export type RunOptions = {
	tasks: Record<string, Task>;
	jobs: stores.job.JobStore;
};

export async function run(options: RunOptions): Promise<void> {
	if (libwt.isMainThread) {
		let promises: Array<Promise<void>> = [];
		for (let type in options.tasks) {
			let scheduler = new Promise<void>(async (resolve, reject) => {
				let getNextDate = options.tasks[type].getNextDate;
				for await (let next_date of getScheduledDates(getNextDate)) {
					let enqueued_jobs = await options.jobs.lookupObjects({
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
					let running_jobs = await options.jobs.lookupObjects({
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
					let metadata = options.tasks[type].getMetadata(next_date);
					let job = await options.jobs.createObject({
						created_utc: Date.now(),
						updated_utc: Date.now(),
						type: type,
						options: metadata.options ?? null,
						description: metadata.description ?? null,
						status: "ENQUEUED",
						started_utc: null,
						ended_utc: null,
						expires_utc: metadata.expires_utc ?? null,
					});
				}
				resolve();
			});
			promises.push(scheduler);
		}
		let poller = new Promise<void>(async (resolve, reject) => {
			let getNextDate = oneSecondFromNow;
			for await (let next_date of getScheduledDates(getNextDate)) {
				let jobs = await options.jobs.lookupObjects({
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
				await runJob(job);
			}
			resolve();
		});
		promises.push(poller);
		let cleaner = new Promise<void>(async (resolve, reject) => {
			let getNextDate = oneMinuteFromNow;
			for await (let next_date of getScheduledDates(getNextDate)) {
				let jobs = await options.jobs.lookupObjects({
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
					await options.jobs.deleteObject(job.job_id).catch(() => undefined);
				}
			}
			resolve();
		});
		promises.push(cleaner);
		await Promise.all(promises);
	} else {
		if (process.argv.length === 3) {
			let job_id = process.argv[2];
			let job = await options.jobs.lookupObject(job_id);
			if (job.status === "ENQUEUED") {
				if (job.type in options.tasks) {
					job = await options.jobs.updateObject({
						...job,
						status: "RUNNING",
						updated_utc: Date.now(),
						started_utc: Date.now()
					});
					try {
						await options.tasks[job.type].run(job.job_id, job.options ?? null);
						job = await options.jobs.updateObject({
							...job,
							status: "SUCCESS",
							updated_utc: Date.now(),
							ended_utc: Date.now()
						});
					} catch (error) {
						job = await options.jobs.updateObject({
							...job,
							status: "FAILURE",
							updated_utc: Date.now(),
							ended_utc: Date.now()
						});
					}
				} else {
					job = await options.jobs.updateObject({
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
};
