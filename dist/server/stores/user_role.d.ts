import * as autoguard from "@joelek/autoguard";
import * as prequel from "@joelek/prequel";
import { UserRoleProperties } from "../objects";
export declare const UNIQUE_USER_ROLE_PROPERTIES: [];
export type UserRole = prequel.stores.Object<UserRoleProperties, "user_role_id">;
export interface UserRoleStore extends prequel.stores.ObjectStore<UserRoleProperties, "user_role_id"> {
}
export declare class VolatileUserRoleStore extends prequel.stores.VolatileObjectStore<UserRoleProperties, "user_role_id"> {
    constructor();
}
export declare const UserRole: autoguard.guards.IntersectionGuard<[{
    user_role_id: string;
}, {
    created_utc: number;
    updated_utc: number;
    user_id: string;
    role_id: string;
}]>;
export declare class DatabaseUserRoleStore extends prequel.stores.DatabaseObjectStore<UserRoleProperties, "user_role_id"> {
    constructor(detail: prequel.stores.DatabaseObjectStoreDetail, table: string);
}
