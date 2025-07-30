import * as autoguard from "@joelek/autoguard";
import { UserProperties } from "../objects";
import { DatabaseObjectStoreDetail, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";

export const UNIQUE_USER_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)(
	"email",
	"username"
);

export type User = Object<UserProperties, "user_id">;

export interface UserStore extends ObjectStore<UserProperties, "user_id"> {};

export class VolatileUserStore extends VolatileObjectStore<UserProperties, "user_id", typeof UNIQUE_USER_PROPERTIES> {
	constructor() {
		super("user_id", UNIQUE_USER_PROPERTIES);
	}
};

export const User = autoguard.guards.Intersection.of(
	autoguard.guards.Object.of({
		user_id: autoguard.guards.String
	}),
	UserProperties
);

export class DatabaseUserStore extends DatabaseObjectStore<UserProperties, "user_id"> {
	constructor(detail: DatabaseObjectStoreDetail, table: string) {
		super(detail, table, "user_id", User);
	}
};
