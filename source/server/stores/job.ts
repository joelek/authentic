import * as autoguard from "@joelek/autoguard";
import { JobProperties } from "../objects";
import { DatabaseObjectStoreDetail, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";

export const UNIQUE_JOB_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)();

export type Job = Object<JobProperties, "job_id">;

export interface JobStore extends  ObjectStore<JobProperties, "job_id"> {};

export class VolatileJobStore extends  VolatileObjectStore<JobProperties, "job_id", typeof UNIQUE_JOB_PROPERTIES> {
	constructor() {
		super("job_id", UNIQUE_JOB_PROPERTIES);
	}
};

export const Job = autoguard.guards.Intersection.of(
	autoguard.guards.Object.of({
		job_id: autoguard.guards.String
	}),
	JobProperties
);

export class DatabaseJobStore extends DatabaseObjectStore<JobProperties, "job_id"> {
	constructor(detail:  DatabaseObjectStoreDetail, table: string) {
		super(detail, table, "job_id", Job);
	}
};
