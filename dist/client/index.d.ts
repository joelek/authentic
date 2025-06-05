import * as autoguard from "@joelek/autoguard/dist/lib-client";
import * as api from "../api/client";
export type ClientOptions = autoguard.api.ClientOptions;
export type Client = api.Client;
export declare function createClient(options?: ClientOptions): Client;
