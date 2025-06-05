import * as api from "../api/client";
export type Options = {
    namespace?: string;
};
export type Client = api.Client;
export declare function createClient(options?: Options): api.Client;
