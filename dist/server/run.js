"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libhttp = require("http");
const server = require("./");
const SERVER = new server.Server();
const REQUEST_LISTENER = SERVER.createRequestListener();
const HTTP_SERVER = libhttp.createServer({}, REQUEST_LISTENER);
const HTTP_HOSTNAME = "localhost";
const HTTP_PORT = 8080;
HTTP_SERVER.listen(HTTP_PORT, HTTP_HOSTNAME, () => {
    console.log(`Server listening at http://${HTTP_HOSTNAME}:${HTTP_PORT}/ ...`);
});
