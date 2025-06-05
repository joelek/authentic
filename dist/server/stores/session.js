"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolatileSessionStore = exports.UNIQUE_SESSION_PROPERTIES = void 0;
const store_1 = require("./store");
exports.UNIQUE_SESSION_PROPERTIES = ((...values) => values)();
;
class VolatileSessionStore extends store_1.VolatileObjectStore {
    constructor() {
        super(exports.UNIQUE_SESSION_PROPERTIES);
    }
}
exports.VolatileSessionStore = VolatileSessionStore;
;
