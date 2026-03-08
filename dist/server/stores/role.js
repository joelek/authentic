"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRoleStore = exports.Role = exports.VolatileRoleStore = exports.UNIQUE_ROLE_PROPERTIES = void 0;
const autoguard = require("@joelek/autoguard");
const prequel = require("@joelek/prequel");
const objects_1 = require("../objects");
exports.UNIQUE_ROLE_PROPERTIES = ((...values) => values)("name");
;
class VolatileRoleStore extends prequel.stores.VolatileObjectStore {
    constructor() {
        super("role_id", exports.UNIQUE_ROLE_PROPERTIES, exports.Role);
    }
}
exports.VolatileRoleStore = VolatileRoleStore;
;
exports.Role = autoguard.guards.Intersection.of(autoguard.guards.Object.of({
    role_id: autoguard.guards.String
}), objects_1.RoleProperties);
class DatabaseRoleStore extends prequel.stores.DatabaseObjectStore {
    constructor(detail, table) {
        super(detail, table, "role_id", exports.Role);
    }
}
exports.DatabaseRoleStore = DatabaseRoleStore;
;
