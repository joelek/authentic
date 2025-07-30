import * as autoguard from "@joelek/autoguard";
import { UserProperties } from "../objects";
import { DatabaseObjectStoreDetail, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";
export declare const UNIQUE_USER_PROPERTIES: ["email", "username"];
export type User = Object<UserProperties, "user_id">;
export interface UserStore extends ObjectStore<UserProperties, "user_id"> {
}
export declare class VolatileUserStore extends VolatileObjectStore<UserProperties, "user_id", typeof UNIQUE_USER_PROPERTIES> {
    constructor();
}
export declare const User: autoguard.guards.IntersectionGuard<[{
    user_id: string;
}, {
    created_utc: number;
    email: string;
    passdata: string;
    username?: string | null | undefined;
}]>;
export declare class DatabaseUserStore extends DatabaseObjectStore<UserProperties, "user_id"> {
    constructor(detail: DatabaseObjectStoreDetail, table: string);
}
