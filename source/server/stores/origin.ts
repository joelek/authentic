import * as autoguard from "@joelek/autoguard";
import { OriginProperties } from "../objects";
import { DatabaseObjectStoreDetail, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";

export const UNIQUE_ORIGIN_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)(
	"address"
);

export type Origin = Object<OriginProperties, "origin_id">;

export interface OriginStore extends ObjectStore<OriginProperties, "origin_id"> {};

export class VolatileOriginStore extends VolatileObjectStore<OriginProperties, "origin_id", typeof UNIQUE_ORIGIN_PROPERTIES> {
	constructor() {
		super("origin_id", UNIQUE_ORIGIN_PROPERTIES, Origin);
	}
};

export const Origin = autoguard.guards.Intersection.of(
	autoguard.guards.Object.of({
		origin_id: autoguard.guards.String
	}),
	OriginProperties
);

export class DatabaseOriginStore extends DatabaseObjectStore<OriginProperties, "origin_id"> {
	constructor(detail: DatabaseObjectStoreDetail, table: string) {
		super(detail, table, "origin_id", Origin);
	}
};
