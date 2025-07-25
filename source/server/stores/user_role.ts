import * as autoguard from "@joelek/autoguard";
import { UserRoleProperties } from "../objects";
import { DatabaseObjectStoreDetail, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";

export const UNIQUE_USER_ROLE_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)(

);

export type UserRole = Object<UserRoleProperties>

export interface UserRoleStore extends ObjectStore<UserRoleProperties> {};

export class VolatileUserRoleStore extends VolatileObjectStore<UserRoleProperties, typeof UNIQUE_USER_ROLE_PROPERTIES> {
	constructor() {
		super(UNIQUE_USER_ROLE_PROPERTIES);
	}
};

export const UserRole = autoguard.guards.Intersection.of(
	autoguard.guards.Object.of({
		id: autoguard.guards.String
	}),
	UserRoleProperties
);

export class DatabaseUserRoleStore extends DatabaseObjectStore<UserRoleProperties> {
	constructor(detail: DatabaseObjectStoreDetail, table: string) {
		super(detail, table, UserRole);
	}
};
