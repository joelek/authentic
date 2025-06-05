import { RoleProperties } from "../objects";
import { Object, ObjectStore, VolatileObjectStore } from "./store";
export declare const UNIQUE_ROLE_PROPERTIES: [];
export type Role = Object<RoleProperties>;
export interface RoleStore extends ObjectStore<RoleProperties> {
}
export declare class VolatileRoleStore extends VolatileObjectStore<RoleProperties, typeof UNIQUE_ROLE_PROPERTIES> {
    constructor();
}
