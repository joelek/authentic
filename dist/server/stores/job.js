"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseJobStore = exports.Job = exports.VolatileJobStore = exports.UNIQUE_JOB_PROPERTIES = void 0;
const autoguard = require("@joelek/autoguard");
const objects_1 = require("../objects");
const store_1 = require("./store");
exports.UNIQUE_JOB_PROPERTIES = ((...values) => values)();
;
class VolatileJobStore extends store_1.VolatileObjectStore {
    constructor() {
        super("job_id", exports.UNIQUE_JOB_PROPERTIES);
    }
}
exports.VolatileJobStore = VolatileJobStore;
;
exports.Job = autoguard.guards.Intersection.of(autoguard.guards.Object.of({
    job_id: autoguard.guards.String
}), objects_1.JobProperties);
class DatabaseJobStore extends store_1.DatabaseObjectStore {
    constructor(detail, table) {
        super(detail, table, "job_id", exports.Job);
    }
}
exports.DatabaseJobStore = DatabaseJobStore;
;
