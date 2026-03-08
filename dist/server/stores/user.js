"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseUserStore = exports.User = exports.VolatileUserStore = exports.UNIQUE_USER_PROPERTIES = void 0;
const autoguard = require("@joelek/autoguard");
const prequel = require("@joelek/prequel");
const objects_1 = require("../objects");
exports.UNIQUE_USER_PROPERTIES = ((...values) => values)("email", "username");
;
class VolatileUserStore extends prequel.stores.VolatileObjectStore {
    constructor() {
        super("user_id", exports.UNIQUE_USER_PROPERTIES, exports.User);
    }
}
exports.VolatileUserStore = VolatileUserStore;
;
exports.User = autoguard.guards.Intersection.of(autoguard.guards.Object.of({
    user_id: autoguard.guards.String
}), objects_1.UserProperties);
class DatabaseUserStore extends prequel.stores.DatabaseObjectStore {
    constructor(detail, table) {
        super(detail, table, "user_id", exports.User);
    }
}
exports.DatabaseUserStore = DatabaseUserStore;
;
