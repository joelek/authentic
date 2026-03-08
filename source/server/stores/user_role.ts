import * as autoguard from "@joelek/autoguard";
import * as prequel from "@joelek/prequel";
import { UserRoleProperties } from "../objects";

export const UNIQUE_USER_ROLE_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)(

);

export type UserRole = prequel.stores.Object<UserRoleProperties, "user_role_id">;

export interface UserRoleStore extends prequel.stores.ObjectStore<UserRoleProperties, "user_role_id"> {};

export class VolatileUserRoleStore extends prequel.stores.VolatileObjectStore<UserRoleProperties, "user_role_id"> {
	constructor() {
		super("user_role_id", UNIQUE_USER_ROLE_PROPERTIES, UserRole);
	}
};

export const UserRole = autoguard.guards.Intersection.of(
	autoguard.guards.Object.of({
		user_role_id: autoguard.guards.String
	}),
	UserRoleProperties
);

export class DatabaseUserRoleStore extends prequel.stores.DatabaseObjectStore<UserRoleProperties, "user_role_id"> {
	constructor(detail: prequel.stores.DatabaseObjectStoreDetail, table: string) {
		super(detail, table, "user_role_id", UserRole);
	}
};
