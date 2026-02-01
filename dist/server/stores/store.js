"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseObjectStore = exports.VolatileObjectStore = exports.ObjectIndex = exports.bisectSortedArray = exports.OBJECT_VALUE_COLLATOR = exports.ExpectedSafeIdentifierError = exports.ExpectedUniquePropertyError = exports.ExpectedObjectError = void 0;
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
class ExpectedSafeIdentifierError extends Error {
    identifer;
    constructor(identifer) {
        super();
        this.identifer = identifer;
    }
    toString() {
        return `Expected "${this.identifer}" to be a safe identifier!`;
    }
    ;
}
exports.ExpectedSafeIdentifierError = ExpectedSafeIdentifierError;
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
    id;
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
        return bisectSortedArray(objects, object, (object) => object[this.key], exports.OBJECT_VALUE_COLLATOR);
    }
    constructor(objects, id, key) {
        this.groups = [];
        this.id = id;
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
                    if (existing_object[this.id] === object[this.id]) {
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
                    if (existing_object[this.id] === object[this.id]) {
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
    id;
    unique_keys;
    guard;
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
            index = new ObjectIndex(this.objects.values(), this.id, key);
            this.indices.set(key, index);
        }
        return index;
    }
    constructor(id, unique_keys, guard) {
        this.id = id;
        this.unique_keys = [...unique_keys];
        this.guard = guard;
        this.objects = new Map();
        this.indices = new Map();
    }
    async createObject(properties) {
        let id = this.createId();
        let object = this.guard.as({
            [this.id]: id,
            ...properties
        });
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
            throw new ExpectedObjectError(this.id, id);
        }
        return this.cloneObject(object);
    }
    async lookupObjects(key, operator, value) {
        let index = this.getIndex(key);
        let objects = index.lookup(operator, value);
        return objects.map((object) => this.cloneObject(object));
    }
    async updateObject(object) {
        object = this.guard.as(object);
        let id = object[this.id];
        let existing_object = this.objects.get(id);
        if (existing_object == null) {
            throw new ExpectedObjectError(this.id, id);
        }
        for (let unique_key of this.unique_keys) {
            let value = object[unique_key];
            if (value != null) {
                let objects = await this.lookupObjects(unique_key, "=", value);
                if (objects.length !== 0 && objects[0][this.id] !== id) {
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
            throw new ExpectedObjectError(this.id, id);
        }
        this.objects.delete(id);
        this.removeFromIndices(object);
        return this.cloneObject(object);
    }
}
exports.VolatileObjectStore = VolatileObjectStore;
;
class DatabaseObjectStore {
    detail;
    table;
    id;
    guard;
    use_ansi_quotes;
    async createId() {
        let id = this.detail.generateId?.() ?? utils.generateHexId(32);
        while (true) {
            let object = await this.lookupObject(id).catch(() => undefined);
            if (object == null) {
                break;
            }
            id = this.detail.generateId?.() ?? utils.generateHexId(32);
        }
        return id;
    }
    escapeIdentifier(identifier) {
        if (this.use_ansi_quotes) {
            return `"${identifier.replaceAll("\"", "\"\"")}"`;
        }
        else {
            if (!/^[a-z_][a-z0-9_]*$/i.test(identifier)) {
                throw new ExpectedSafeIdentifierError(identifier);
            }
            return identifier;
        }
    }
    constructor(detail, table, id, guard, options) {
        this.detail = detail;
        this.table = table;
        this.id = id;
        this.guard = guard;
        this.use_ansi_quotes = options?.use_ansi_quotes ?? true;
    }
    async createObject(properties) {
        let connection = await this.detail.getConnection();
        let id = await this.createId();
        let object = this.guard.as({
            [this.id]: id,
            ...properties
        });
        let columns = [
            ...Object.keys(object)
        ];
        let values = [
            ...Object.values(object)
        ];
        await connection.query(`
			INSERT INTO ${this.escapeIdentifier(this.table)} (
				${columns.map((column) => `${this.escapeIdentifier(column)}`).join(",\r\n				")}
			) VALUES (
				${"?".repeat(columns.length).split("").join(",\r\n				")}
			)
		`, values);
        return this.lookupObject(id);
    }
    async lookupObject(id) {
        let connection = await this.detail.getConnection();
        let objects = await connection.query(`
			SELECT
				*
			FROM
				${this.escapeIdentifier(this.table)}
			WHERE
				${this.escapeIdentifier(this.id)} = ?
		`, [
            id
        ]);
        if (objects.length === 0) {
            throw new ExpectedObjectError(this.id, id);
        }
        return this.guard.as(objects[0]);
    }
    async lookupObjects(key, operator, value) {
        let connection = await this.detail.getConnection();
        let objects = await connection.query(`
			SELECT
				*
			FROM
				${this.escapeIdentifier(this.table)}
			WHERE
				${this.escapeIdentifier(String(key))} ${operator} ?
		`, [
            value
        ]);
        return autoguard.guards.Array.of(this.guard).as(objects);
    }
    async updateObject(object) {
        object = this.guard.as(object);
        let connection = await this.detail.getConnection();
        let id = object[this.id];
        let existing_object = await this.lookupObject(id).catch(() => undefined);
        if (existing_object == null) {
            throw new ExpectedObjectError(this.id, id);
        }
        let columns = [
            ...Object.keys(object)
        ];
        let values = [
            ...Object.values(object)
        ];
        for (let key in existing_object) {
            if (!(key in object)) {
                columns.push(key);
                values.push(undefined);
            }
        }
        await connection.query(`
			UPDATE
				${this.escapeIdentifier(this.table)}
			SET
				${columns.map((column) => `${this.escapeIdentifier(column)} = ?`).join(",\r\n				")}
			WHERE
				${this.escapeIdentifier(this.id)} = ?
		`, [
            ...values,
            id
        ]);
        return this.lookupObject(id);
    }
    async deleteObject(id) {
        let connection = await this.detail.getConnection();
        let object = await this.lookupObject(id).catch(() => undefined);
        if (object == null) {
            throw new ExpectedObjectError(this.id, id);
        }
        await connection.query(`
			DELETE
			FROM
				${this.escapeIdentifier(this.table)}
			WHERE
				${this.escapeIdentifier(this.id)} = ?
		`, [
            id
        ]);
        return object;
    }
}
exports.DatabaseObjectStore = DatabaseObjectStore;
;
