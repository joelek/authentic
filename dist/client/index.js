"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
const api = require("../api/client");
const shared = require("../shared");
function createClient(options) {
    let urlPrefix = shared.getUrlPrefix(options?.namespace);
    return api.makeClient({
        urlPrefix
    });
}
exports.createClient = createClient;
;
