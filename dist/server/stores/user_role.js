"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseUserRoleStore = exports.UserRole = exports.VolatileUserRoleStore = exports.UNIQUE_USER_ROLE_PROPERTIES = void 0;
const autoguard = require("@joelek/autoguard");
const objects_1 = require("../objects");
const store_1 = require("./store");
exports.UNIQUE_USER_ROLE_PROPERTIES = ((...values) => values)();
;
class VolatileUserRoleStore extends store_1.VolatileObjectStore {
    constructor() {
        super(exports.UNIQUE_USER_ROLE_PROPERTIES);
    }
}
exports.VolatileUserRoleStore = VolatileUserRoleStore;
;
exports.UserRole = autoguard.guards.Intersection.of(autoguard.guards.Object.of({
    id: autoguard.guards.String
}), objects_1.UserRoleProperties);
class DatabaseUserRoleStore extends store_1.DatabaseObjectStore {
    constructor(detail, table) {
        super(detail, table, exports.UserRole);
    }
}
exports.DatabaseUserRoleStore = DatabaseUserRoleStore;
;
