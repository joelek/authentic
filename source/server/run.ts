import * as libhttp from "http";
import * as authentic from "./";

const SERVER = new authentic.server.Server();

const AUTH_REQUEST_LISTENER = SERVER.createAuthRequestListener({
	urlPrefix: "/auth"
});

const APP_REQUEST_LISTENER = SERVER.createAppRequestListener(async (request, access_handler) => {
	let user = access_handler.requireAuthorization(/* Required roles... */);
	return {
		payload: {
			user
		}
	};
});

const HTTP_SERVER = libhttp.createServer({}, async (request, response) => {
	let url = request.url ?? "/";
	if (url.startsWith("/auth/")) {
		return AUTH_REQUEST_LISTENER(request, response);
	} else {
		return APP_REQUEST_LISTENER(request, response);
	}
});

const HTTP_HOSTNAME = "localhost";

const HTTP_PORT = 8080;

HTTP_SERVER.listen(HTTP_PORT, HTTP_HOSTNAME, () => {
	console.log(`Server listening at http://${HTTP_HOSTNAME}:${HTTP_PORT}/ ...`);
});
