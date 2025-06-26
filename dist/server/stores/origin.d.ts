import * as autoguard from "@joelek/autoguard";
import { OriginProperties } from "../objects";
import { ConnectionLike, DatabaseObjectStore, Object, ObjectStore, VolatileObjectStore } from "./store";
export declare const UNIQUE_ORIGIN_PROPERTIES: ["address"];
export type Origin = Object<OriginProperties>;
export interface OriginStore extends ObjectStore<OriginProperties> {
}
export declare class VolatileOriginStore extends VolatileObjectStore<OriginProperties, typeof UNIQUE_ORIGIN_PROPERTIES> {
    constructor();
}
export declare const Origin: autoguard.guards.IntersectionGuard<[{
    id: string;
}, {
    address: string;
    expires_utc: number;
    wait_until_utc: number;
}]>;
export declare class DatabaseOriginStore extends DatabaseObjectStore<OriginProperties> {
    constructor(connection: ConnectionLike, table: string, id: string);
}
