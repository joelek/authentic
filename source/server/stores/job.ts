import * as autoguard from "@joelek/autoguard";
import * as prequel from "@joelek/prequel";
import { JobProperties } from "../objects";

export const UNIQUE_JOB_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)();

export type Job = prequel.stores.Object<JobProperties, "job_id">;

export interface JobStore extends prequel.stores.ObjectStore<JobProperties, "job_id"> {};

export class VolatileJobStore extends prequel.stores.VolatileObjectStore<JobProperties, "job_id"> {
	constructor() {
		super("job_id", UNIQUE_JOB_PROPERTIES, Job);
	}
};

export const Job = autoguard.guards.Intersection.of(
	autoguard.guards.Object.of({
		job_id: autoguard.guards.String
	}),
	JobProperties
);

export class DatabaseJobStore extends prequel.stores.DatabaseObjectStore<JobProperties, "job_id"> {
	constructor(detail: prequel.stores.DatabaseObjectStoreDetail, table: string) {
		super(detail, table, "job_id", Job);
	}
};
