import * as stores from "./stores";
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
export type RunOptions = {
    tasks: Record<string, Task>;
    jobs: stores.job.JobStore;
};
export declare function run(options: RunOptions): Promise<void>;
