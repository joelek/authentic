import * as libhttp from "http";
import * as server from "./";

const AUTHENTICATOR = new server.Authenticator();
const REQUEST_LISTENER = AUTHENTICATOR.createRequestListener();
const HTTP_SERVER = libhttp.createServer({}, REQUEST_LISTENER);
const HTTP_HOSTNAME = "localhost";
const HTTP_PORT = 8080;

HTTP_SERVER.listen(HTTP_PORT, HTTP_HOSTNAME, () => {
	console.log(`Server listening at http://${HTTP_HOSTNAME}:${HTTP_PORT}/ ...`);
});
