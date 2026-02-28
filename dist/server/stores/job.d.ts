import * as autoguard from "@joelek/autoguard";
import { JobProperties } from "../objects";
import { DatabaseObjectStoreDetail, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";
export declare const UNIQUE_JOB_PROPERTIES: [];
export type Job = Object<JobProperties, "job_id">;
export interface JobStore extends ObjectStore<JobProperties, "job_id"> {
}
export declare class VolatileJobStore extends VolatileObjectStore<JobProperties, "job_id"> {
    constructor();
}
export declare const Job: autoguard.guards.IntersectionGuard<[{
    job_id: string;
}, {
    created_utc: number;
    updated_utc: number;
    type: string;
    options: string | null;
    description: string | null;
    status: "ENQUEUED" | "RUNNING" | "SUCCESS" | "FAILURE";
    started_utc: number | null;
    ended_utc: number | null;
    expires_utc: number | null;
}]>;
export declare class DatabaseJobStore extends DatabaseObjectStore<JobProperties, "job_id"> {
    constructor(detail: DatabaseObjectStoreDetail, table: string);
}
