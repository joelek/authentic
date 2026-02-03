"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
const libwt = require("worker_threads");
const job_1 = require("./stores/job");
function oneSecondFromNow() {
    let date = new Date();
    date.setUTCSeconds(date.getUTCSeconds() + 1);
    return date;
}
;
function oneMinuteFromNow() {
    let date = new Date();
    date.setUTCMinutes(date.getUTCMinutes() + 1);
    return date;
}
;
async function waitUntil(target_ms) {
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
}
;
class Runner {
    tasks;
    jobs;
    async *generateDates(date_provider) {
        while (true) {
            let date = date_provider();
            if (date == null) {
                break;
            }
            await waitUntil(date.getTime());
            yield date;
        }
    }
    async *generateScheduledJobs(scheduler) {
        while (true) {
            let scheduled_job = scheduler();
            if (scheduled_job == null) {
                break;
            }
            await waitUntil(scheduled_job.date.getTime());
            yield scheduled_job;
        }
    }
    async runJob(job) {
        console.log(`Running job with type ${job.type} and id ${job.job_id}...`);
        await new Promise((resolve, reject) => {
            let worker = new libwt.Worker(__filename, {
                argv: [job.job_id]
            });
            worker.on("exit", resolve);
        });
        console.log(`Job with type ${job.type} and id ${job.job_id} completed.`);
    }
    async startBroker() {
        let promises = [];
        for (let type in this.tasks) {
            let scheduler = new Promise(async (resolve, reject) => {
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
        let poller = new Promise(async (resolve, reject) => {
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
        let cleaner = new Promise(async (resolve, reject) => {
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
    async startWorker() {
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
                    }
                    catch (error) {
                        job = await this.jobs.updateObject({
                            ...job,
                            status: "FAILURE",
                            updated_utc: Date.now(),
                            ended_utc: Date.now()
                        });
                    }
                }
                else {
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
    constructor(options) {
        this.tasks = options?.tasks ?? {};
        this.jobs = options?.jobs ?? new job_1.VolatileJobStore();
    }
    isMainThread() {
        return libwt.isMainThread;
    }
    async enqueue(type, metadata) {
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
    start() {
        if (this.isMainThread()) {
            return this.startBroker();
        }
        else {
            return this.startWorker();
        }
    }
}
exports.Runner = Runner;
;
