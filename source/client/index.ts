import * as autoguard from "@joelek/autoguard/dist/lib-client";
import * as api from "../api/client";

export type ClientOptions = autoguard.api.ClientOptions;

export type Client = api.Client;

export function createClient(options?: ClientOptions): Client {
	return api.makeClient(options);
};
