import * as autoguard from "@joelek/autoguard";
import { RoleProperties } from "../objects";
import { DatabaseObjectStoreDetail, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";
export declare const UNIQUE_ROLE_PROPERTIES: ["name"];
export type Role = Object<RoleProperties, "role_id">;
export interface RoleStore extends ObjectStore<RoleProperties, "role_id"> {
}
export declare class VolatileRoleStore extends VolatileObjectStore<RoleProperties, "role_id", typeof UNIQUE_ROLE_PROPERTIES> {
    constructor();
}
export declare const Role: autoguard.guards.IntersectionGuard<[{
    role_id: string;
}, {
    created_utc: number;
    name: string;
}]>;
export declare class DatabaseRoleStore extends DatabaseObjectStore<RoleProperties, "role_id"> {
    constructor(detail: DatabaseObjectStoreDetail, table: string);
}
