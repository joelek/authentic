import { SessionProperties } from "../objects";
import { Object, ObjectStore, VolatileObjectStore } from "./store";

export const UNIQUE_SESSION_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)();

export type Session = Object<SessionProperties>

export interface SessionStore extends ObjectStore<SessionProperties> {};

export class VolatileSessionStore extends VolatileObjectStore<SessionProperties, typeof UNIQUE_SESSION_PROPERTIES> {
	constructor() {
		super(UNIQUE_SESSION_PROPERTIES);
	}
};
