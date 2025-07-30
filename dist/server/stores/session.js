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
        super("session_id", exports.UNIQUE_SESSION_PROPERTIES);
    }
}
exports.VolatileSessionStore = VolatileSessionStore;
;
exports.Session = autoguard.guards.Intersection.of(autoguard.guards.Object.of({
    session_id: autoguard.guards.String
}), objects_1.SessionProperties);
class DatabaseSessionStore extends store_1.DatabaseObjectStore {
    constructor(detail, table) {
        super(detail, table, "session_id", exports.Session);
    }
}
exports.DatabaseSessionStore = DatabaseSessionStore;
;
