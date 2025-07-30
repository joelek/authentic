import * as autoguard from "@joelek/autoguard";
import { UserRoleProperties } from "../objects";
import { DatabaseObjectStoreDetail, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";
export declare const UNIQUE_USER_ROLE_PROPERTIES: [];
export type UserRole = Object<UserRoleProperties>;
export interface UserRoleStore extends ObjectStore<UserRoleProperties> {
}
export declare class VolatileUserRoleStore extends VolatileObjectStore<UserRoleProperties, typeof UNIQUE_USER_ROLE_PROPERTIES> {
    constructor();
}
export declare const UserRole: autoguard.guards.IntersectionGuard<[{
    id: string;
}, {
    created_utc: number;
    user_id: string;
    role_id: string;
}]>;
export declare class DatabaseUserRoleStore extends DatabaseObjectStore<UserRoleProperties> {
    constructor(detail: DatabaseObjectStoreDetail, table: string);
}
