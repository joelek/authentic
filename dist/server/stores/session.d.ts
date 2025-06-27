import * as autoguard from "@joelek/autoguard";
import { SessionProperties } from "../objects";
import { ConnectionProvider, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";
export declare const UNIQUE_SESSION_PROPERTIES: [];
export type Session = Object<SessionProperties>;
export interface SessionStore extends ObjectStore<SessionProperties> {
}
export declare class VolatileSessionStore extends VolatileObjectStore<SessionProperties, typeof UNIQUE_SESSION_PROPERTIES> {
    constructor();
}
export declare const Session: autoguard.guards.IntersectionGuard<[{
    id: string;
}, SessionProperties]>;
export declare class DatabaseSessionStore extends DatabaseObjectStore<SessionProperties> {
    constructor(connection_provider: ConnectionProvider, table: string);
}
