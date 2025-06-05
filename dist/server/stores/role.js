"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolatileRoleStore = exports.UNIQUE_ROLE_PROPERTIES = void 0;
const store_1 = require("./store");
exports.UNIQUE_ROLE_PROPERTIES = ((...values) => values)();
;
class VolatileRoleStore extends store_1.VolatileObjectStore {
    constructor() {
        super(exports.UNIQUE_ROLE_PROPERTIES);
    }
}
exports.VolatileRoleStore = VolatileRoleStore;
;
