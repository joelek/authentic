import * as autoguard from "@joelek/autoguard";
import { OriginProperties } from "../objects";
import { DatabaseObjectStoreDetail, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";
export declare const UNIQUE_ORIGIN_PROPERTIES: ["address"];
export type Origin = Object<OriginProperties, "origin_id">;
export interface OriginStore extends ObjectStore<OriginProperties, "origin_id"> {
}
export declare class VolatileOriginStore extends VolatileObjectStore<OriginProperties, "origin_id", typeof UNIQUE_ORIGIN_PROPERTIES> {
    constructor();
}
export declare const Origin: autoguard.guards.IntersectionGuard<[{
    origin_id: string;
}, {
    created_utc: number;
    address: string;
    expires_utc: number;
    wait_until_utc: number;
}]>;
export declare class DatabaseOriginStore extends DatabaseObjectStore<OriginProperties, "origin_id"> {
    constructor(detail: DatabaseObjectStoreDetail, table: string);
}
