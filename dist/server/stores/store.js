"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseObjectStore = exports.VolatileObjectStore = exports.ObjectIndex = exports.bisectSortedArray = exports.OBJECT_VALUE_COLLATOR = exports.ExpectedUniquePropertyError = exports.ExpectedObjectError = void 0;
const autoguard = require("@joelek/autoguard");
const shared_1 = require("../../shared");
const utils = require("../utils");
class ExpectedObjectError extends Error {
    key;
    value;
    constructor(key, value) {
        super();
        this.key = key;
        this.value = value;
    }
    toString() {
        return `Expected an object with "${String(this.key)}" equal to "${String(this.value)}"!`;
    }
}
exports.ExpectedObjectError = ExpectedObjectError;
;
class ExpectedUniquePropertyError extends Error {
    key;
    value;
    constructor(key, value) {
        super();
        this.key = key;
        this.value = value;
    }
    toString() {
        return `Expected object with "${String(this.key)}" equal to "${String(this.value)}" to be unique!`;
    }
}
exports.ExpectedUniquePropertyError = ExpectedUniquePropertyError;
;
const OBJECT_VALUE_COLLATOR = (one, two) => {
    if (one == null) {
        if (two == null) {
            return "IDENTICAL";
        }
        else {
            return "ONE_COMES_FIRST";
        }
    }
    else {
        if (two == null) {
            return "TWO_COMES_FIRST";
        }
        else {
            if (one < two) {
                return "ONE_COMES_FIRST";
            }
            if (two < one) {
                return "TWO_COMES_FIRST";
            }
            return "IDENTICAL";
        }
    }
};
exports.OBJECT_VALUE_COLLATOR = OBJECT_VALUE_COLLATOR;
function bisectSortedArray(objects, object, mapper, collator) {
    function recurse(offset, length) {
        if (length <= 0) {
            return offset;
        }
        let pivot = offset + (length >> 1);
        let outcome = collator(mapper(object), mapper(objects[pivot]));
        if (outcome === "IDENTICAL") {
            return pivot;
        }
        if (outcome === "ONE_COMES_FIRST") {
            return recurse(offset, pivot - offset);
        }
        else {
            return recurse(pivot + 1, length - (pivot + 1) - offset);
        }
    }
    ;
    return recurse(0, objects.length);
}
exports.bisectSortedArray = bisectSortedArray;
;
class ObjectIndex {
    groups;
    key;
    collectObjects(min_group_index, max_group_index) {
        let objects = [];
        min_group_index = Math.max(0, Math.min(min_group_index, this.groups.length));
        max_group_index = Math.max(0, Math.min(max_group_index, this.groups.length));
        for (let group_index = min_group_index; group_index < max_group_index; group_index += 1) {
            objects.push(...this.groups[group_index].objects);
        }
        return objects;
    }
    findGroupIndex(value) {
        return bisectSortedArray(this.groups, { value, objects: [] }, (group) => group.value, exports.OBJECT_VALUE_COLLATOR);
    }
    findObjectIndex(objects, object) {
        return bisectSortedArray(objects, object, (object) => object.id, exports.OBJECT_VALUE_COLLATOR);
    }
    constructor(objects, key) {
        this.groups = [];
        this.key = key;
        for (let object of objects) {
            this.insert(object);
        }
    }
    insert(object) {
        let value = object[this.key];
        let group_index = this.findGroupIndex(value);
        if (group_index >= 0 && group_index < this.groups.length) {
            let group = this.groups[group_index];
            if ((0, exports.OBJECT_VALUE_COLLATOR)(value, group.value) === "IDENTICAL") {
                let object_index = this.findObjectIndex(group.objects, object);
                if (object_index >= 0 && object_index < group.objects.length) {
                    let existing_object = group.objects[object_index];
                    if (existing_object.id === object.id) {
                        return;
                    }
                }
                group.objects.splice(object_index, 0, object);
                return;
            }
        }
        this.groups.splice(group_index, 0, {
            value: value,
            objects: [
                object
            ]
        });
    }
    lookup(operator, value) {
        let group_index = this.findGroupIndex(value);
        let collator_result = (0, exports.OBJECT_VALUE_COLLATOR)(this.groups[group_index]?.value, value);
        if (operator === "<") {
            if (collator_result === "ONE_COMES_FIRST") {
                return this.collectObjects(0, group_index + 1);
            }
            if (collator_result === "IDENTICAL") {
                return this.collectObjects(0, group_index);
            }
            if (collator_result === "TWO_COMES_FIRST") {
                return this.collectObjects(0, group_index);
            }
        }
        if (operator === "<=") {
            if (collator_result === "ONE_COMES_FIRST") {
                return this.collectObjects(0, group_index + 1);
            }
            if (collator_result === "IDENTICAL") {
                return this.collectObjects(0, group_index + 1);
            }
            if (collator_result === "TWO_COMES_FIRST") {
                return this.collectObjects(0, group_index);
            }
        }
        if (operator === "=") {
            if (collator_result === "ONE_COMES_FIRST") {
                return [];
            }
            if (collator_result === "IDENTICAL") {
                return this.collectObjects(group_index, group_index + 1);
            }
            if (collator_result === "TWO_COMES_FIRST") {
                return [];
            }
        }
        if (operator === ">") {
            if (collator_result === "ONE_COMES_FIRST") {
                return this.collectObjects(group_index + 1, this.groups.length);
            }
            if (collator_result === "IDENTICAL") {
                return this.collectObjects(group_index + 1, this.groups.length);
            }
            if (collator_result === "TWO_COMES_FIRST") {
                return this.collectObjects(group_index, this.groups.length);
            }
        }
        if (operator === ">=") {
            if (collator_result === "ONE_COMES_FIRST") {
                return this.collectObjects(group_index + 1, this.groups.length);
            }
            if (collator_result === "IDENTICAL") {
                return this.collectObjects(group_index, this.groups.length);
            }
            if (collator_result === "TWO_COMES_FIRST") {
                return this.collectObjects(group_index, this.groups.length);
            }
        }
        throw new shared_1.ExpectedUnreachableCodeError();
    }
    remove(object) {
        let value = object[this.key];
        let group_index = this.findGroupIndex(value);
        if (group_index >= 0 && group_index < this.groups.length) {
            let group = this.groups[group_index];
            if ((0, exports.OBJECT_VALUE_COLLATOR)(value, group.value) === "IDENTICAL") {
                let object_index = this.findObjectIndex(group.objects, object);
                if (object_index >= 0 && object_index < group.objects.length) {
                    let existing_object = group.objects[object_index];
                    if (existing_object.id === object.id) {
                        group.objects.splice(object_index, 1);
                        if (group.objects.length === 0) {
                            this.groups.splice(group_index, 1);
                        }
                        return;
                    }
                }
            }
        }
    }
}
exports.ObjectIndex = ObjectIndex;
;
;
class VolatileObjectStore {
    unique_keys;
    objects;
    indices;
    insertIntoIndices(object) {
        for (let [key, index] of this.indices) {
            index.insert(object);
        }
    }
    updateObjectIndices(existing_object, object) {
        this.removeFromIndices(existing_object);
        this.insertIntoIndices(object);
    }
    removeFromIndices(object) {
        for (let [key, index] of this.indices) {
            index.remove(object);
        }
    }
    cloneObject(object) {
        return {
            ...object
        };
    }
    createId() {
        let id = utils.generateHexId(32);
        while (this.objects.has(id)) {
            id = utils.generateHexId(32);
        }
        return id;
    }
    getIndex(key) {
        let index = this.indices.get(key);
        if (index == null) {
            index = new ObjectIndex(this.objects.values(), key);
            this.indices.set(key, index);
        }
        return index;
    }
    constructor(unique_keys) {
        this.unique_keys = [...unique_keys];
        this.objects = new Map();
        this.indices = new Map();
    }
    async createObject(properties) {
        let id = this.createId();
        let object = {
            id,
            ...properties
        };
        for (let unique_key of this.unique_keys) {
            let value = object[unique_key];
            if (value != null) {
                let objects = await this.lookupObjects(unique_key, "=", value);
                if (objects.length !== 0) {
                    throw new ExpectedUniquePropertyError(unique_key, value);
                }
            }
        }
        this.objects.set(id, object);
        this.insertIntoIndices(object);
        return this.cloneObject(object);
    }
    async lookupObject(id) {
        let object = this.objects.get(id);
        if (object == null) {
            throw new ExpectedObjectError("id", id);
        }
        return this.cloneObject(object);
    }
    async lookupObjects(key, operator, value) {
        let index = this.getIndex(key);
        let objects = index.lookup(operator, value);
        return objects.map((object) => this.cloneObject(object));
    }
    async updateObject(object) {
        let id = object.id;
        let existing_object = this.objects.get(id);
        if (existing_object == null) {
            throw new ExpectedObjectError("id", id);
        }
        for (let unique_key of this.unique_keys) {
            let value = object[unique_key];
            if (value != null) {
                let objects = await this.lookupObjects(unique_key, "=", value);
                if (objects.length !== 0 && objects[0].id !== id) {
                    throw new ExpectedUniquePropertyError(unique_key, value);
                }
            }
        }
        object = this.cloneObject(object);
        this.objects.set(id, object);
        this.updateObjectIndices(existing_object, object);
        return this.cloneObject(object);
    }
    async deleteObject(id) {
        let object = this.objects.get(id);
        if (object == null) {
            throw new ExpectedObjectError("id", id);
        }
        this.objects.delete(id);
        this.removeFromIndices(object);
        return this.cloneObject(object);
    }
}
exports.VolatileObjectStore = VolatileObjectStore;
;
class DatabaseObjectStore {
    connection;
    table;
    guard;
    async createId() {
        let id = utils.generateHexId(32);
        while (true) {
            let object = await this.lookupObject(id).catch(() => undefined);
            if (object == null) {
                break;
            }
            id = utils.generateHexId(32);
        }
        return id;
    }
    escapeIdentifier(identifier) {
        return `"${identifier.replaceAll("\"", "\"\"")}"`;
    }
    constructor(connection, table, guard) {
        this.connection = connection;
        this.table = table;
        this.guard = guard;
    }
    async createObject(properties) {
        let id = await this.createId();
        let columns = [
            "id",
            ...Object.keys(properties)
        ];
        let values = [
            id,
            ...Object.values(properties)
        ];
        await this.connection.query(`
			INSERT INTO ${this.escapeIdentifier(this.table)} (
				${columns.map((column) => `${this.escapeIdentifier(column)}`).join(",\r\n				")}
			)
			VALUES (
				${"?".repeat(columns.length).split("").join(",\r\n				")}
			)
		`, values);
        return this.lookupObject(id);
    }
    async lookupObject(id) {
        let values = [
            id
        ];
        let objects = await this.connection.query(`
			SELECT
				*
			FROM ${this.escapeIdentifier(this.table)}
			WHERE
				${this.escapeIdentifier("id")} = ?
		`, values);
        if (objects.length === 0) {
            throw new ExpectedObjectError("id", id);
        }
        return this.guard.as(objects[0]);
    }
    async lookupObjects(key, operator, value) {
        let values = [
            value
        ];
        let objects = await this.connection.query(`
			SELECT
				*
			FROM ${this.escapeIdentifier(this.table)}
			WHERE
				${this.escapeIdentifier(String(key))} ${operator} ?
		`, values);
        return autoguard.guards.Array.of(this.guard).as(objects);
    }
    async updateObject(object) {
        let id = object.id;
        let columns = [
            ...Object.keys(object)
        ];
        let values = [
            ...Object.values(object),
            id
        ];
        await this.connection.query(`
			UPDATE ${this.escapeIdentifier(this.table)}
			SET
				${columns.map((column) => `${this.escapeIdentifier(column)} = ?`).join(",\r\n				")}
			WHERE
				${this.escapeIdentifier("id")} = ?
		`, values);
        return this.lookupObject(object.id);
    }
    async deleteObject(id) {
        let object = await this.lookupObject(id);
        let values = [
            id
        ];
        await this.connection.query(`
			DELETE
			FROM ${this.escapeIdentifier(this.table)}
			WHERE
				${this.escapeIdentifier("id")} = ?
		`, values);
        return object;
    }
}
exports.DatabaseObjectStore = DatabaseObjectStore;
;
