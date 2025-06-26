import * as autoguard from "@joelek/autoguard";
import { ExpectedUnreachableCodeError } from "../../shared";
import * as utils from "../utils";

export class ExpectedObjectError extends Error {
	readonly key: ObjectKey;
	readonly value: ObjectValue;

	constructor(key: ObjectKey, value: ObjectValue) {
		super();
		this.key = key;
		this.value = value;
	}

	toString(): string {
		return `Expected an object with "${String(this.key)}" equal to "${String(this.value)}"!`;
	}
};

export class ExpectedUniquePropertyError extends Error {
	readonly key: ObjectKey;
	readonly value: ObjectValue;

	constructor(key: ObjectKey, value: ObjectValue) {
		super();
		this.key = key;
		this.value = value;
	}

	toString(): string {
		return `Expected object with "${String(this.key)}" equal to "${String(this.value)}" to be unique!`;
	}
};

export type ObjectKey = PropertyKey;

export type ObjectValue = string | number | boolean | undefined | null | bigint;

export type ObjectProperties<A> = {
	[B in keyof A]: ObjectValue;
};

export type Object<A extends ObjectProperties<A>> = A & {
	id: string;
};

export type CollatorResult = "ONE_COMES_FIRST" | "IDENTICAL" | "TWO_COMES_FIRST";

export type Collator<A> = (one: A, two: A) => CollatorResult;

export const OBJECT_VALUE_COLLATOR: Collator<ObjectValue> = (one, two) => {
	if (one == null) {
		if (two == null) {
			return "IDENTICAL";
		} else {
			return "ONE_COMES_FIRST";
		}
	} else {
		if (two == null) {
			return "TWO_COMES_FIRST";
		} else {
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

export type Mapper<A, B> = (value: A) => B;

export function bisectSortedArray<A, B>(objects: Array<A>, object: A, mapper: Mapper<A, B>, collator: Collator<B>): number {
	function recurse(offset: number, length: number): number {
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
		} else {
			return recurse(pivot + 1, length - (pivot + 1) - offset);
		}
	};
	return recurse(0, objects.length);
};

export type ObjectGroup<A extends ObjectProperties<A>, B extends keyof A> = {
	value: A[B];
	objects: Array<Object<A>>;
};

export type Operator = ">" | ">=" | "=" | "<" | "<=";

export class ObjectIndex<A extends ObjectProperties<A>, B extends keyof A> {
	protected groups: Array<ObjectGroup<Object<A>, B>>;
	protected key: B;

	protected collectObjects(min_group_index: number, max_group_index: number): Array<Object<A>> {
		let objects: Array<Object<A>> = [];
		min_group_index = Math.max(0, Math.min(min_group_index, this.groups.length));
		max_group_index = Math.max(0, Math.min(max_group_index, this.groups.length));
		for (let group_index = min_group_index; group_index < max_group_index; group_index += 1) {
			objects.push(...this.groups[group_index].objects);
		}
		return objects;
	}

	protected findGroupIndex(value: Object<A>[B]): number {
		return bisectSortedArray(this.groups, { value, objects: [] }, (group) => group.value, OBJECT_VALUE_COLLATOR);
	}

	protected findObjectIndex(objects: Array<Object<A>>, object: Object<A>): number {
		return bisectSortedArray(objects, object, (object) => object.id, OBJECT_VALUE_COLLATOR);
	}

	constructor(objects: Iterable<Object<A>>, key: B) {
		this.groups = [];
		this.key = key;
		for (let object of objects) {
			this.insert(object);
		}
	}

	insert(object: Object<A>): void {
		let value = object[this.key];
		let group_index = this.findGroupIndex(value);
		if (group_index >= 0 && group_index < this.groups.length) {
			let group = this.groups[group_index];
			if (OBJECT_VALUE_COLLATOR(value, group.value) === "IDENTICAL") {
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

	lookup(operator: Operator, value: Object<A>[B]): Array<Object<A>> {
		let group_index = this.findGroupIndex(value);
		let collator_result = OBJECT_VALUE_COLLATOR(this.groups[group_index]?.value, value);
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
		throw new ExpectedUnreachableCodeError();
	}

	remove(object: Object<A>): void {
		let value = object[this.key];
		let group_index = this.findGroupIndex(value);
		if (group_index >= 0 && group_index < this.groups.length) {
			let group = this.groups[group_index];
			if (OBJECT_VALUE_COLLATOR(value, group.value) === "IDENTICAL") {
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
};

export interface ObjectStore<A extends ObjectProperties<A>> {
	createObject(properties: A): Promise<Object<A>>;
	lookupObject(id: string): Promise<Object<A>>;
	lookupObjects<C extends keyof A>(key: C, operator: Operator, value: Object<A>[C]): Promise<Array<Object<A>>>;
	updateObject(object: Object<A>): Promise<Object<A>>;
	deleteObject(id: string): Promise<Object<A>>;
};

export class VolatileObjectStore<A extends ObjectProperties<A>, B extends Array<keyof A>> implements ObjectStore<A> {
	protected unique_keys: [...B];
	protected objects: Map<string, Object<A>>;
	protected indices: Map<keyof A, ObjectIndex<A, keyof A>>;

	protected insertIntoIndices(object: Object<A>): void {
		for (let [key, index] of this.indices) {
			index.insert(object);
		}
	}

	protected updateObjectIndices(existing_object: Object<A>, object: Object<A>): void {
		this.removeFromIndices(existing_object);
		this.insertIntoIndices(object);
	}

	protected removeFromIndices(object: Object<A>): void {
		for (let [key, index] of this.indices) {
			index.remove(object);
		}
	}

	protected cloneObject(object: Object<A>): Object<A> {
		return {
			...object
		};
	}

	protected createId(): string {
		let id = utils.generateHexId(32);
		while (this.objects.has(id)) {
			id = utils.generateHexId(32);
		}
		return id;
	}

	protected getIndex<C extends keyof A>(key: C): ObjectIndex<A, C> {
		let index = this.indices.get(key) as ObjectIndex<A, C>;
		if (index == null) {
			index = new ObjectIndex(this.objects.values(), key);
			this.indices.set(key, index);
		}
		return index;
	}

	constructor(unique_keys: [...B]) {
		this.unique_keys = [ ...unique_keys ];
		this.objects = new Map();
		this.indices = new Map();
	}

	async createObject(properties: A): Promise<Object<A>> {
		let id = this.createId();
		let object: Object<A> = {
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

	async lookupObject(id: string): Promise<Object<A>> {
		let object = this.objects.get(id);
		if (object == null) {
			throw new ExpectedObjectError("id", id);
		}
		return this.cloneObject(object);
	}

	async lookupObjects<C extends keyof A>(key: C, operator: Operator, value: Object<A>[C]): Promise<Array<Object<A>>> {
		let index = this.getIndex(key);
		let objects = index.lookup(operator, value);
		return objects.map((object) => this.cloneObject(object));
	}

	async updateObject(object: Object<A>): Promise<Object<A>> {
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

	async deleteObject(id: string): Promise<Object<A>> {
		let object = this.objects.get(id);
		if (object == null) {
			throw new ExpectedObjectError("id", id);
		}
		this.objects.delete(id);
		this.removeFromIndices(object);
		return this.cloneObject(object);
	}
};

export type ConnectionLike = {
	query<A>(sql: string, parameters?: Array<ObjectValue>): Promise<A>;
};

export class DatabaseObjectStore<A extends ObjectProperties<A>> implements ObjectStore<A> {
	protected connection: ConnectionLike;
	protected table: string;
	protected id: string;
	protected guard: autoguard.serialization.MessageGuardBase<Object<A>>;

	protected async createId(): Promise<string> {
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

	protected escapeIdentifier(identifier: string): string {
		return `"${identifier.replaceAll("\"", "\"\"")}"`;
	}

	constructor(connection: ConnectionLike, table: string, id: string, guard: autoguard.serialization.MessageGuardBase<Object<A>>) {
		this.connection = connection;
		this.table = table;
		this.id = id;
		this.guard = guard;
	}

	async createObject(properties: A): Promise<Object<A>> {
		let id = await this.createId();
		let columns = [
			this.id,
			...Object.keys(properties)
		];
		let values = [
			id,
			...Object.values<ObjectValue>(properties)
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

	async lookupObject(id: string): Promise<Object<A>> {
		let values = [
			id
		];
		let objects = await this.connection.query<Array<Record<string, ObjectValue>>>(`
			SELECT
				*
			FROM ${this.escapeIdentifier(this.table)}
			WHERE
				${this.escapeIdentifier(this.id)} = ?
		`, values);
		objects = objects.map((object) => {
			object["id"] = object[this.id];
			delete object[this.id];
			return object;
		});
		if (objects.length === 0) {
			throw new ExpectedObjectError(this.id, id);
		}
		return this.guard.as(objects[0]);
	}

	async lookupObjects<C extends keyof A>(key: C, operator: Operator, value: Object<A>[C]): Promise<Object<A>[]> {
		let values = [
			value
		];
		let objects = await this.connection.query<Array<Record<string, ObjectValue>>>(`
			SELECT
				*
			FROM ${this.escapeIdentifier(this.table)}
			WHERE
				${this.escapeIdentifier(String(key))} ${operator} ?
		`, values);
		objects = objects.map((object) => {
			object["id"] = object[this.id];
			delete object[this.id];
			return object;
		});
		return autoguard.guards.Array.of(this.guard).as(objects);
	}

	async updateObject(object: Object<A>): Promise<Object<A>> {
		let id = object.id;
		let columns = [
			...Object.keys(object)
		];
		let values = [
			...Object.values<ObjectValue>(object),
			id
		];
		await this.connection.query(`
			UPDATE ${this.escapeIdentifier(this.table)}
			SET
				${columns.map((column) => `${this.escapeIdentifier(column)} = ?`).join(",\r\n				")}
			WHERE
				${this.escapeIdentifier(this.id)} = ?
		`, values);
		return this.lookupObject(object.id);
	}

	async deleteObject(id: string): Promise<Object<A>> {
		let object = await this.lookupObject(id);
		let values = [
			id
		];
		await this.connection.query(`
			DELETE
			FROM ${this.escapeIdentifier(this.table)}
			WHERE
				${this.escapeIdentifier(this.id)} = ?
		`, values);
		return object;
	}
};
