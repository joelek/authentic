import * as stores from "./stores";
export type JobMetadata = Partial<Pick<stores.job.Job, "description" | "options">>;
export type JobResult = {
    delete?: boolean;
};
export type Task = {
    run(job_id: string, options: string | null): Promise<JobResult>;
    getNextDate(): Date | null;
    getMetadata(next_date: Date): JobMetadata;
};
export type RunOptions = {
    tasks: Record<string, Task>;
    jobs: stores.job.JobStore;
};
export declare function run(options: RunOptions): Promise<void>;
