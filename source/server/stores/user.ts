import * as autoguard from "@joelek/autoguard";
import { UserProperties } from "../objects";
import { ConnectionProvider, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";

export const UNIQUE_USER_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)(
	"email",
	"username"
);

export type User = Object<UserProperties>

export interface UserStore extends ObjectStore<UserProperties> {};

export class VolatileUserStore extends VolatileObjectStore<UserProperties, typeof UNIQUE_USER_PROPERTIES> {
	constructor() {
		super(UNIQUE_USER_PROPERTIES);
	}
};

export const User = autoguard.guards.Intersection.of(
	autoguard.guards.Object.of({
		id: autoguard.guards.String
	}),
	UserProperties
);

export class DatabaseUserStore extends DatabaseObjectStore<UserProperties> {
	constructor(connection_provider: ConnectionProvider, table: string) {
		super(connection_provider, table, User);
	}
};
