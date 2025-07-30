import * as autoguard from "@joelek/autoguard";
import { SessionProperties } from "../objects";
import { DatabaseObjectStoreDetail, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";
export declare const UNIQUE_SESSION_PROPERTIES: [];
export type Session = Object<SessionProperties, "session_id">;
export interface SessionStore extends ObjectStore<SessionProperties, "session_id"> {
}
export declare class VolatileSessionStore extends VolatileObjectStore<SessionProperties, "session_id", typeof UNIQUE_SESSION_PROPERTIES> {
    constructor();
}
export declare const Session: autoguard.guards.IntersectionGuard<[{
    session_id: string;
}, SessionProperties]>;
export declare class DatabaseSessionStore extends DatabaseObjectStore<SessionProperties, "session_id"> {
    constructor(detail: DatabaseObjectStoreDetail, table: string);
}
