import * as api from "../api/client";
import * as shared from "../shared";

export type ClientOptions = {};

export type Client = api.Client;

export function createClient(options?: ClientOptions): api.Client {
	let urlPrefix = shared.getUrlPrefix();
	return api.makeClient({
		urlPrefix
	});
};
