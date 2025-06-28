import * as autoguard from "@joelek/autoguard";
import { RoleProperties } from "../objects";
import { ConnectionProvider, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";

export const UNIQUE_ROLE_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)(
	"name"
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
	constructor(connection_provider: ConnectionProvider, table: string) {
		super(connection_provider, table, Role);
	}
};
