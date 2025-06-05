"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
const api = require("../api/client");
function createClient(options) {
    return api.makeClient(options);
}
exports.createClient = createClient;
;
