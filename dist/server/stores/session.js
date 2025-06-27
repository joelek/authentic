"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSessionStore = exports.Session = exports.VolatileSessionStore = exports.UNIQUE_SESSION_PROPERTIES = void 0;
const autoguard = require("@joelek/autoguard");
const objects_1 = require("../objects");
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
exports.Session = autoguard.guards.Intersection.of(autoguard.guards.Object.of({
    id: autoguard.guards.String
}), objects_1.SessionProperties);
class DatabaseSessionStore extends store_1.DatabaseObjectStore {
    constructor(connection_provider, table) {
        super(connection_provider, table, exports.Session);
    }
}
exports.DatabaseSessionStore = DatabaseSessionStore;
;
