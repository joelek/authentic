import * as stores from "./stores";
export type Task = {
    run(job_id: string): Promise<void>;
    getNextDate(): Date | null;
};
export type RunOptions = {
    tasks: Record<string, Task>;
    jobs: stores.job.JobStore;
};
export declare function run(options: RunOptions): Promise<void>;
