import * as stores from "./stores";
export type Task = {
    run(job_id: string, options: string | null): Promise<void>;
    getNextDate(): Date | null;
};
export type RunOptions = {
    tasks: Record<string, Task>;
    jobs: stores.job.JobStore;
};
export declare function run(options: RunOptions): Promise<void>;
