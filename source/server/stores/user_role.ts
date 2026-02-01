import * as autoguard from "@joelek/autoguard";
import { UserRoleProperties } from "../objects";
import { DatabaseObjectStoreDetail, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";

export const UNIQUE_USER_ROLE_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)(

);

export type UserRole = Object<UserRoleProperties, "user_role_id">;

export interface UserRoleStore extends ObjectStore<UserRoleProperties, "user_role_id"> {};

export class VolatileUserRoleStore extends VolatileObjectStore<UserRoleProperties, "user_role_id", typeof UNIQUE_USER_ROLE_PROPERTIES> {
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

export class DatabaseUserRoleStore extends DatabaseObjectStore<UserRoleProperties, "user_role_id"> {
	constructor(detail: DatabaseObjectStoreDetail, table: string) {
		super(detail, table, "user_role_id", UserRole);
	}
};
