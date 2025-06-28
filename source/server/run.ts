import * as libhttp from "http";
import * as authentic from "./";

const SERVER = new authentic.server.Server();
const REQUEST_LISTENER = SERVER.createRequestListener();
const HTTP_SERVER = libhttp.createServer({}, REQUEST_LISTENER);
const HTTP_HOSTNAME = "localhost";
const HTTP_PORT = 8080;

HTTP_SERVER.listen(HTTP_PORT, HTTP_HOSTNAME, () => {
	console.log(`Server listening at http://${HTTP_HOSTNAME}:${HTTP_PORT}/ ...`);
});
