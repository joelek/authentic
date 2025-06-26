import * as autoguard from "@joelek/autoguard";
import { OriginProperties } from "../objects";
import { ConnectionLike, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";

export const UNIQUE_ORIGIN_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)(
	"address"
);

export type Origin = Object<OriginProperties>

export interface OriginStore extends ObjectStore<OriginProperties> {};

export class VolatileOriginStore extends VolatileObjectStore<OriginProperties, typeof UNIQUE_ORIGIN_PROPERTIES> {
	constructor() {
		super(UNIQUE_ORIGIN_PROPERTIES);
	}
};

export const Origin = autoguard.guards.Intersection.of(
	autoguard.guards.Object.of({
		id: autoguard.guards.String
	}),
	OriginProperties
);

export class DatabaseOriginStore extends DatabaseObjectStore<OriginProperties> {
	constructor(connection: ConnectionLike, table: string) {
		super(connection, table, Origin);
	}
};
