import * as autoguard from "@joelek/autoguard";
import { RoleProperties } from "../objects";
import { DatabaseObjectStoreDetail, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";

export const UNIQUE_ROLE_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)(
	"name"
);

export type Role = Object<RoleProperties, "role_id">;

export interface RoleStore extends ObjectStore<RoleProperties, "role_id"> {};

export class VolatileRoleStore extends VolatileObjectStore<RoleProperties, "role_id", typeof UNIQUE_ROLE_PROPERTIES> {
	constructor() {
		super("role_id", UNIQUE_ROLE_PROPERTIES, Role);
	}
};

export const Role = autoguard.guards.Intersection.of(
	autoguard.guards.Object.of({
		role_id: autoguard.guards.String
	}),
	RoleProperties
);

export class DatabaseRoleStore extends DatabaseObjectStore<RoleProperties, "role_id"> {
	constructor(detail: DatabaseObjectStoreDetail, table: string) {
		super(detail, table, "role_id", Role);
	}
};
