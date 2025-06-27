import * as autoguard from "@joelek/autoguard";
import { UserProperties } from "../objects";
import { ConnectionProvider, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";
export declare const UNIQUE_USER_PROPERTIES: ["email", "username"];
export type User = Object<UserProperties>;
export interface UserStore extends ObjectStore<UserProperties> {
}
export declare class VolatileUserStore extends VolatileObjectStore<UserProperties, typeof UNIQUE_USER_PROPERTIES> {
    constructor();
}
export declare const User: autoguard.guards.IntersectionGuard<[{
    id: string;
}, {
    email: string;
    passdata: string;
    username?: string | null | undefined;
}]>;
export declare class DatabaseUserStore extends DatabaseObjectStore<UserProperties> {
    constructor(connection_provider: ConnectionProvider, table: string);
}
