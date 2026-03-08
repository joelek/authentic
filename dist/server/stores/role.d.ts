import * as autoguard from "@joelek/autoguard";
import * as prequel from "@joelek/prequel";
import { RoleProperties } from "../objects";
export declare const UNIQUE_ROLE_PROPERTIES: ["name"];
export type Role = prequel.stores.Object<RoleProperties, "role_id">;
export interface RoleStore extends prequel.stores.ObjectStore<RoleProperties, "role_id"> {
}
export declare class VolatileRoleStore extends prequel.stores.VolatileObjectStore<RoleProperties, "role_id"> {
    constructor();
}
export declare const Role: autoguard.guards.IntersectionGuard<[{
    role_id: string;
}, {
    created_utc: number;
    updated_utc: number;
    name: string;
}]>;
export declare class DatabaseRoleStore extends prequel.stores.DatabaseObjectStore<RoleProperties, "role_id"> {
    constructor(detail: prequel.stores.DatabaseObjectStoreDetail, table: string);
}
