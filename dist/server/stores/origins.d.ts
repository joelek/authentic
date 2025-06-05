import { OriginProperties } from "../objects";
import { Object, ObjectStore, VolatileObjectStore } from "./store";
export declare const UNIQUE_ORIGIN_PROPERTIES: ["address"];
export type Origin = Object<OriginProperties>;
export interface OriginStore extends ObjectStore<OriginProperties> {
}
export declare class VolatileOriginStore extends VolatileObjectStore<OriginProperties, typeof UNIQUE_ORIGIN_PROPERTIES> {
    constructor();
}
