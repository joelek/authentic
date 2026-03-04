import * as mariadb from "mariadb";
import * as server from "../server";
export declare function getConnection(): Promise<mariadb.Connection>;
export declare const OBJECTS: server.stores.store.DatabaseObjectStore<{
    object_id: string;
    optional_boolean: boolean | null;
    optional_integer: number | null;
    optional_string: string | null;
}, "object_id">;
