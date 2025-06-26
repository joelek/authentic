"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseUserStore = exports.User = exports.VolatileUserStore = exports.UNIQUE_USER_PROPERTIES = void 0;
const autoguard = require("@joelek/autoguard");
const objects_1 = require("../objects");
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
exports.User = autoguard.guards.Intersection.of(autoguard.guards.Object.of({
    id: autoguard.guards.String
}), objects_1.UserProperties);
class DatabaseUserStore extends store_1.DatabaseObjectStore {
    constructor(connection, table, id) {
        super(connection, table, id, exports.User);
    }
}
exports.DatabaseUserStore = DatabaseUserStore;
;
