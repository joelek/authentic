import * as autoguard from "@joelek/autoguard";
import { RoleProperties } from "../objects";
import { ConnectionLike, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";
export declare const UNIQUE_ROLE_PROPERTIES: [];
export type Role = Object<RoleProperties>;
export interface RoleStore extends ObjectStore<RoleProperties> {
}
export declare class VolatileRoleStore extends VolatileObjectStore<RoleProperties, typeof UNIQUE_ROLE_PROPERTIES> {
    constructor();
}
export declare const Role: autoguard.guards.IntersectionGuard<[{
    id: string;
}, {
    user_id: string;
    name: string;
}]>;
export declare class DatabaseRoleStore extends DatabaseObjectStore<RoleProperties> {
    constructor(connection: ConnectionLike, table: string, id: string);
}
