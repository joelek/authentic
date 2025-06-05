"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolatileUserStore = exports.UNIQUE_USER_PROPERTIES = void 0;
const store_1 = require("./store");
exports.UNIQUE_USER_PROPERTIES = ((...values) => values)("email", "username");
;
class VolatileUserStore extends store_1.VolatileObjectStore {
    constructor() {
        super(exports.UNIQUE_USER_PROPERTIES);
    }
}
exports.VolatileUserStore = VolatileUserStore;
;
