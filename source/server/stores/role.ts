import * as autoguard from "@joelek/autoguard";
import { RoleProperties } from "../objects";
import { ConnectionLike, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";

export const UNIQUE_ROLE_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)(

);

export type Role = Object<RoleProperties>

export interface RoleStore extends ObjectStore<RoleProperties> {};

export class VolatileRoleStore extends VolatileObjectStore<RoleProperties, typeof UNIQUE_ROLE_PROPERTIES> {
	constructor() {
		super(UNIQUE_ROLE_PROPERTIES);
	}
};

export const Role = autoguard.guards.Intersection.of(
	autoguard.guards.Object.of({
		id: autoguard.guards.String
	}),
	RoleProperties
);

export class DatabaseRoleStore extends DatabaseObjectStore<RoleProperties> {
	constructor(connection: ConnectionLike, table: string) {
		super(connection, table, Role);
	}
};
