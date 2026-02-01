import * as autoguard from "@joelek/autoguard";
import { SessionProperties } from "../objects";
import { DatabaseObjectStoreDetail, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";

export const UNIQUE_SESSION_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)();

export type Session = Object<SessionProperties, "session_id">;

export interface SessionStore extends ObjectStore<SessionProperties, "session_id"> {};

export class VolatileSessionStore extends VolatileObjectStore<SessionProperties, "session_id", typeof UNIQUE_SESSION_PROPERTIES> {
	constructor() {
		super("session_id", UNIQUE_SESSION_PROPERTIES, Session);
	}
};

export const Session = autoguard.guards.Intersection.of(
	autoguard.guards.Object.of({
		session_id: autoguard.guards.String
	}),
	SessionProperties
);

export class DatabaseSessionStore extends DatabaseObjectStore<SessionProperties, "session_id"> {
	constructor(detail: DatabaseObjectStoreDetail, table: string) {
		super(detail, table, "session_id", Session);
	}
};
