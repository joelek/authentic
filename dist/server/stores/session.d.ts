import * as autoguard from "@joelek/autoguard";
import * as prequel from "@joelek/prequel";
import { SessionProperties } from "../objects";
export declare const UNIQUE_SESSION_PROPERTIES: [];
export type Session = prequel.stores.Object<SessionProperties, "session_id">;
export interface SessionStore extends prequel.stores.ObjectStore<SessionProperties, "session_id"> {
}
export declare class VolatileSessionStore extends prequel.stores.VolatileObjectStore<SessionProperties, "session_id"> {
    constructor();
}
export declare const Session: autoguard.guards.IntersectionGuard<[{
    session_id: string;
}, SessionProperties]>;
export declare class DatabaseSessionStore extends prequel.stores.DatabaseObjectStore<SessionProperties, "session_id"> {
    constructor(detail: prequel.stores.DatabaseObjectStoreDetail, table: string);
}
