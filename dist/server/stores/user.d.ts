import { UserProperties } from "../objects";
import { Object, ObjectStore, VolatileObjectStore } from "./store";
export declare const UNIQUE_USER_PROPERTIES: ["email", "username"];
export type User = Object<UserProperties>;
export interface UserStore extends ObjectStore<UserProperties> {
}
export declare class VolatileUserStore extends VolatileObjectStore<UserProperties, typeof UNIQUE_USER_PROPERTIES> {
    constructor();
}
