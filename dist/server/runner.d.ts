import * as autoguard from "@joelek/autoguard";
import * as stores from "./stores";
import { JSON } from "../shared";
export type DateProvider = () => Date | undefined;
export type ScheduledJob<A extends JSON> = {
    date: Date;
    metadata: JobMetadata<A>;
};
export type TaskScheduler<A extends JSON> = () => ScheduledJob<A> | undefined;
export type JobMetadata<A extends JSON> = {
    options: A;
    expires_utc?: number | null;
};
export type TaskRunner<A extends JSON> = (job_id: string, options: A) => Promise<void>;
export type Task<A extends JSON> = {
    runner: TaskRunner<A>;
    scheduler?: TaskScheduler<A>;
    guard?: autoguard.serialization.MessageGuard<A>;
};
export type Options<A extends Options<A>> = {
    [B in keyof A]: JSON;
};
export type TasksFromOptions<A extends Options<A>> = {
    [B in keyof A]: Task<A[B]>;
};
export type RunnerOptions<A extends Options<A>> = {
    tasks: TasksFromOptions<A>;
    jobs?: stores.job.JobStore;
};
export declare class Runner<A extends Options<A>> {
    protected tasks: TasksFromOptions<A>;
    protected jobs: stores.job.JobStore;
    protected generateDates(date_provider: DateProvider): AsyncGenerator<Date>;
    protected generateScheduledJobs<A extends JSON>(scheduler: TaskScheduler<A>): AsyncGenerator<ScheduledJob<A>>;
    protected runJob(job: stores.job.Job): Promise<void>;
    protected startBroker(): Promise<void>;
    protected startWorker(): Promise<boolean>;
    constructor(options: RunnerOptions<A>);
    isMainThread(): boolean;
    enqueue<C extends keyof A & string>(type: C, metadata: JobMetadata<A[C]>): Promise<void>;
    start(): Promise<void>;
}
