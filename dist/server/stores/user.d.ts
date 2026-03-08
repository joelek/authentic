import * as autoguard from "@joelek/autoguard";
import * as prequel from "@joelek/prequel";
import { UserProperties } from "../objects";
export declare const UNIQUE_USER_PROPERTIES: ["email", "username"];
export type User = prequel.stores.Object<UserProperties, "user_id">;
export interface UserStore extends prequel.stores.ObjectStore<UserProperties, "user_id"> {
}
export declare class VolatileUserStore extends prequel.stores.VolatileObjectStore<UserProperties, "user_id"> {
    constructor();
}
export declare const User: autoguard.guards.IntersectionGuard<[{
    user_id: string;
}, {
    created_utc: number;
    updated_utc: number;
    email: string;
    passdata: string;
    username: string | null;
}]>;
export declare class DatabaseUserStore extends prequel.stores.DatabaseObjectStore<UserProperties, "user_id"> {
    constructor(detail: prequel.stores.DatabaseObjectStoreDetail, table: string);
}
