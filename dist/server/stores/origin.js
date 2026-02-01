"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseOriginStore = exports.Origin = exports.VolatileOriginStore = exports.UNIQUE_ORIGIN_PROPERTIES = void 0;
const autoguard = require("@joelek/autoguard");
const objects_1 = require("../objects");
const store_1 = require("./store");
exports.UNIQUE_ORIGIN_PROPERTIES = ((...values) => values)("address");
;
class VolatileOriginStore extends store_1.VolatileObjectStore {
    constructor() {
        super("origin_id", exports.UNIQUE_ORIGIN_PROPERTIES, exports.Origin);
    }
}
exports.VolatileOriginStore = VolatileOriginStore;
;
exports.Origin = autoguard.guards.Intersection.of(autoguard.guards.Object.of({
    origin_id: autoguard.guards.String
}), objects_1.OriginProperties);
class DatabaseOriginStore extends store_1.DatabaseObjectStore {
    constructor(detail, table) {
        super(detail, table, "origin_id", exports.Origin);
    }
}
exports.DatabaseOriginStore = DatabaseOriginStore;
;
