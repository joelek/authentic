import * as autoguard from "@joelek/autoguard";
import { UserRoleProperties } from "../objects";
import { DatabaseObjectStoreDetail, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";
export declare const UNIQUE_USER_ROLE_PROPERTIES: [];
export type UserRole = Object<UserRoleProperties, "user_role_id">;
export interface UserRoleStore extends ObjectStore<UserRoleProperties, "user_role_id"> {
}
export declare class VolatileUserRoleStore extends VolatileObjectStore<UserRoleProperties, "user_role_id", typeof UNIQUE_USER_ROLE_PROPERTIES> {
    constructor();
}
export declare const UserRole: autoguard.guards.IntersectionGuard<[{
    user_role_id: string;
}, {
    created_utc: number;
    user_id: string;
    role_id: string;
}]>;
export declare class DatabaseUserRoleStore extends DatabaseObjectStore<UserRoleProperties, "user_role_id"> {
    constructor(detail: DatabaseObjectStoreDetail, table: string);
}
