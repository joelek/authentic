import * as api from "../api/client";
export type Options = {
    namespace?: string;
};
export declare function createClient(options?: Options): api.Client;
