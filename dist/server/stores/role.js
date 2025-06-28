"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRoleStore = exports.Role = exports.VolatileRoleStore = exports.UNIQUE_ROLE_PROPERTIES = void 0;
const autoguard = require("@joelek/autoguard");
const objects_1 = require("../objects");
const store_1 = require("./store");
exports.UNIQUE_ROLE_PROPERTIES = ((...values) => values)("name");
;
class VolatileRoleStore extends store_1.VolatileObjectStore {
    constructor() {
        super(exports.UNIQUE_ROLE_PROPERTIES);
    }
}
exports.VolatileRoleStore = VolatileRoleStore;
;
exports.Role = autoguard.guards.Intersection.of(autoguard.guards.Object.of({
    id: autoguard.guards.String
}), objects_1.RoleProperties);
class DatabaseRoleStore extends store_1.DatabaseObjectStore {
    constructor(detail, table) {
        super(detail, table, exports.Role);
    }
}
exports.DatabaseRoleStore = DatabaseRoleStore;
;
