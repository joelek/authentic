import * as autoguard from "@joelek/autoguard";
import * as prequel from "@joelek/prequel";
import { RoleProperties } from "../objects";

export const UNIQUE_ROLE_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)(
	"name"
);

export type Role = prequel.stores.Object<RoleProperties, "role_id">;

export interface RoleStore extends prequel.stores.ObjectStore<RoleProperties, "role_id"> {};

export class VolatileRoleStore extends prequel.stores.VolatileObjectStore<RoleProperties, "role_id"> {
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

export class DatabaseRoleStore extends prequel.stores.DatabaseObjectStore<RoleProperties, "role_id"> {
	constructor(detail: prequel.stores.DatabaseObjectStoreDetail, table: string) {
		super(detail, table, "role_id", Role);
	}
};
