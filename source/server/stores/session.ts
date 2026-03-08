import * as autoguard from "@joelek/autoguard";
import * as prequel from "@joelek/prequel";
import { SessionProperties } from "../objects";

export const UNIQUE_SESSION_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)();

export type Session = prequel.stores.Object<SessionProperties, "session_id">;

export interface SessionStore extends prequel.stores.ObjectStore<SessionProperties, "session_id"> {};

export class VolatileSessionStore extends prequel.stores.VolatileObjectStore<SessionProperties, "session_id"> {
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

export class DatabaseSessionStore extends prequel.stores.DatabaseObjectStore<SessionProperties, "session_id"> {
	constructor(detail: prequel.stores.DatabaseObjectStoreDetail, table: string) {
		super(detail, table, "session_id", Session);
	}
};
