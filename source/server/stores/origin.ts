import * as autoguard from "@joelek/autoguard";
import * as prequel from "@joelek/prequel";
import { OriginProperties } from "../objects";

export const UNIQUE_ORIGIN_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)(
	"address"
);

export type Origin = prequel.stores.Object<OriginProperties, "origin_id">;

export interface OriginStore extends prequel.stores.ObjectStore<OriginProperties, "origin_id"> {};

export class VolatileOriginStore extends prequel.stores.VolatileObjectStore<OriginProperties, "origin_id"> {
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

export class DatabaseOriginStore extends prequel.stores.DatabaseObjectStore<OriginProperties, "origin_id"> {
	constructor(detail: prequel.stores.DatabaseObjectStoreDetail, table: string) {
		super(detail, table, "origin_id", Origin);
	}
};
