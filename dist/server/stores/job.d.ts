import * as autoguard from "@joelek/autoguard";
import * as prequel from "@joelek/prequel";
import { JobProperties } from "../objects";
export declare const UNIQUE_JOB_PROPERTIES: [];
export type Job = prequel.stores.Object<JobProperties, "job_id">;
export interface JobStore extends prequel.stores.ObjectStore<JobProperties, "job_id"> {
}
export declare class VolatileJobStore extends prequel.stores.VolatileObjectStore<JobProperties, "job_id"> {
    constructor();
}
export declare const Job: autoguard.guards.IntersectionGuard<[{
    job_id: string;
}, {
    created_utc: number;
    updated_utc: number;
    type: string;
    options: string;
    status: "ENQUEUED" | "RUNNING" | "SUCCESS" | "FAILURE";
    started_utc: number | null;
    ended_utc: number | null;
    expires_utc: number | null;
}]>;
export declare class DatabaseJobStore extends prequel.stores.DatabaseObjectStore<JobProperties, "job_id"> {
    constructor(detail: prequel.stores.DatabaseObjectStoreDetail, table: string);
}
