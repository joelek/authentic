import { SessionProperties } from "../objects";
import { Object, ObjectStore, VolatileObjectStore } from "./store";
export declare const UNIQUE_SESSION_PROPERTIES: [];
export type Session = Object<SessionProperties>;
export interface SessionStore extends ObjectStore<SessionProperties> {
}
export declare class VolatileSessionStore extends VolatileObjectStore<SessionProperties, typeof UNIQUE_SESSION_PROPERTIES> {
    constructor();
}
