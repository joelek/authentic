import * as autoguard from "@joelek/autoguard";
import * as prequel from "@joelek/prequel";
import { OriginProperties } from "../objects";
export declare const UNIQUE_ORIGIN_PROPERTIES: ["address"];
export type Origin = prequel.stores.Object<OriginProperties, "origin_id">;
export interface OriginStore extends prequel.stores.ObjectStore<OriginProperties, "origin_id"> {
}
export declare class VolatileOriginStore extends prequel.stores.VolatileObjectStore<OriginProperties, "origin_id"> {
    constructor();
}
export declare const Origin: autoguard.guards.IntersectionGuard<[{
    origin_id: string;
}, {
    created_utc: number;
    updated_utc: number;
    address: string;
    expires_utc: number;
    wait_until_utc: number;
}]>;
export declare class DatabaseOriginStore extends prequel.stores.DatabaseObjectStore<OriginProperties, "origin_id"> {
    constructor(detail: prequel.stores.DatabaseObjectStoreDetail, table: string);
}
