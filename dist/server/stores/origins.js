"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolatileOriginStore = exports.UNIQUE_ORIGIN_PROPERTIES = void 0;
const store_1 = require("./store");
exports.UNIQUE_ORIGIN_PROPERTIES = ((...values) => values)("address");
;
class VolatileOriginStore extends store_1.VolatileObjectStore {
    constructor() {
        super(exports.UNIQUE_ORIGIN_PROPERTIES);
    }
}
exports.VolatileOriginStore = VolatileOriginStore;
;
