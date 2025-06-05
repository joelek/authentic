import * as api from "../api/client";
import * as shared from "../shared";

export type ClientOptions = {
	namespace?: string;
};

export type Client = api.Client;

export function createClient(options?: ClientOptions): api.Client {
	let urlPrefix = shared.getUrlPrefix(options?.namespace);
	return api.makeClient({
		urlPrefix
	});
};
