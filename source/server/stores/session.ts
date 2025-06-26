import * as autoguard from "@joelek/autoguard";
import { SessionProperties } from "../objects";
import { ConnectionLike, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";

export const UNIQUE_SESSION_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)();

export type Session = Object<SessionProperties>

export interface SessionStore extends ObjectStore<SessionProperties> {};

export class VolatileSessionStore extends VolatileObjectStore<SessionProperties, typeof UNIQUE_SESSION_PROPERTIES> {
	constructor() {
		super(UNIQUE_SESSION_PROPERTIES);
	}
};

export const Session = autoguard.guards.Intersection.of(
	autoguard.guards.Object.of({
		id: autoguard.guards.String
	}),
	SessionProperties
);

export class DatabaseSessionStore extends DatabaseObjectStore<SessionProperties> {
	constructor(connection: ConnectionLike, table: string) {
		super(connection, table, Session);
	}
};
