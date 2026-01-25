"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const libwt = require("worker_threads");
async function runJob(job) {
    console.log(`Running job with id ${job.job_id}...`);
    await new Promise((resolve, reject) => {
        let worker = new libwt.Worker(__filename, {
            argv: [job.job_id]
        });
        worker.on("exit", resolve);
    });
    console.log(`Job with id ${job.job_id} completed.`);
}
;
function oneSecondFromNow() {
    let date = new Date();
    date.setUTCSeconds(date.getUTCSeconds() + 1);
    return date;
}
;
async function* getScheduledDates(getNextDate) {
    while (true) {
        let next_date = getNextDate();
        if (next_date == null) {
            break;
        }
        await waitUntil(next_date.getTime());
        yield;
    }
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
async function run(options) {
    if (libwt.isMainThread) {
        let promises = [];
        for (let type in options.tasks) {
            let last_job_id = null;
            let scheduler = new Promise(async (resolve, reject) => {
                let getNextDate = options.tasks[type].getNextDate;
                for await (let _ of getScheduledDates(getNextDate)) {
                    if (last_job_id != null) {
                        let job = await options.jobs.lookupObject(last_job_id);
                        if (job.status === "ENQUEUED" || job.status === "RUNNING") {
                            continue;
                        }
                    }
                    let job = await options.jobs.createObject({
                        created_utc: Date.now(),
                        updated_utc: Date.now(),
                        type: type,
                        options: null,
                        status: "ENQUEUED",
                        started_utc: null,
                        ended_utc: null
                    });
                    last_job_id = job.job_id;
                }
                resolve();
            });
            promises.push(scheduler);
        }
        let poller = new Promise(async (resolve, reject) => {
            let getNextDate = oneSecondFromNow;
            for await (let _ of getScheduledDates(getNextDate)) {
                let job = (await options.jobs.lookupObjects("status", "=", "ENQUEUED")).pop();
                if (job == null) {
                    continue;
                }
                await runJob(job);
            }
            resolve();
        });
        promises.push(poller);
        await Promise.all(promises);
    }
    else {
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
                    }
                    catch (error) {
                        job = await options.jobs.updateObject({
                            ...job,
                            status: "FAILURE",
                            updated_utc: Date.now(),
                            ended_utc: Date.now()
                        });
                    }
                }
                else {
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
}
exports.run = run;
;
