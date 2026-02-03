import * as stores from "./stores";
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
export type RunOptions = {
    tasks?: Record<string, Task>;
    jobs?: stores.job.JobStore;
};
export declare class Runner {
    protected tasks: Record<string, Task>;
    protected jobs: stores.job.JobStore;
    protected generateDates(date_provider: DateProvider): AsyncGenerator<Date>;
    protected generateScheduledJobs(scheduler: TaskScheduler): AsyncGenerator<ScheduledJob>;
    protected runJob(job: stores.job.Job): Promise<void>;
    constructor(options?: RunOptions);
    isMainThread(): boolean;
    start(): Promise<void>;
}
