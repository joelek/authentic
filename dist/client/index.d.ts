import * as api from "../api/client";
export type ClientOptions = {
    namespace?: string;
};
export type Client = api.Client;
export declare function createClient(options?: ClientOptions): api.Client;
