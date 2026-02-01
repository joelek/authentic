import * as autoguard from "@joelek/autoguard";
import { ExpectedUnreachableCodeError } from "../../shared";
import * as utils from "../utils";
import { BooleanOperator, IntegerOperator, Operator, Order, StringOperator, Where, WhereAll, WhereAny, WhereBoolean, WhereInteger, WhereNot, WhereString } from "../prequel";

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

export class ExpectedSafeIdentifierError extends Error {
	readonly identifer: string;

	constructor(identifer: string) {
		super();
		this.identifer = identifer;
	}

	toString(): string {
		return `Expected "${this.identifer}" to be a safe identifier!`;
	};
};

export type ObjectKey = PropertyKey;

export type ObjectValue = string | number | boolean | undefined | null | bigint;

export type ObjectProperties<A> = {
	[B in keyof A]: ObjectValue;
};

export type Object<A extends ObjectProperties<A>, B extends string> = A & {
	[C in B]: string;
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

export type ObjectGroup<A extends ObjectProperties<A>, B extends string, C extends keyof A> = {
	value: A[C];
	objects: Array<Object<A, B>>;
};

export class ObjectIndex<A extends ObjectProperties<A>, B extends string, C extends keyof A> {
	protected groups: Array<ObjectGroup<A, B, C>>;
	protected id: B;
	protected key: C;

	protected collectObjects(min_group_index: number, max_group_index: number): Array<Object<A, B>> {
		let objects: Array<Object<A, B>> = [];
		min_group_index = Math.max(0, Math.min(min_group_index, this.groups.length));
		max_group_index = Math.max(0, Math.min(max_group_index, this.groups.length));
		for (let group_index = min_group_index; group_index < max_group_index; group_index += 1) {
			objects.push(...this.groups[group_index].objects);
		}
		return objects;
	}

	protected findGroupIndex(value: Object<A, B>[C]): number {
		return bisectSortedArray(this.groups, { value, objects: [] }, (group) => group.value, OBJECT_VALUE_COLLATOR);
	}

	protected findObjectIndex(objects: Array<Object<A, B>>, object: Object<A, B>): number {
		return bisectSortedArray(objects, object, (object) => object[this.key], OBJECT_VALUE_COLLATOR);
	}

	constructor(objects: Iterable<Object<A, B>>, id: B, key: C) {
		this.groups = [];
		this.id = id;
		this.key = key;
		for (let object of objects) {
			this.insert(object);
		}
	}

	insert(object: Object<A, B>): void {
		let value = object[this.key];
		let group_index = this.findGroupIndex(value);
		if (group_index >= 0 && group_index < this.groups.length) {
			let group = this.groups[group_index];
			if (OBJECT_VALUE_COLLATOR(value, group.value) === "IDENTICAL") {
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

	lookup(operator: Operator, value: Object<A, B>[C]): Array<Object<A, B>> {
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
		if (operator === "==") {
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
		if (operator === "!=") {
			if (collator_result === "ONE_COMES_FIRST") {
				return [
					...this.collectObjects(0, group_index + 1),
					...this.collectObjects(group_index + 1, this.groups.length)
				];
			}
			if (collator_result === "IDENTICAL") {
				return [
					...this.collectObjects(0, group_index),
					...this.collectObjects(group_index + 1, this.groups.length)
				];
			}
			if (collator_result === "TWO_COMES_FIRST") {
				return [
					...this.collectObjects(0, group_index),
					...this.collectObjects(group_index, this.groups.length)
				];
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

	remove(object: Object<A, B>): void {
		let value = object[this.key];
		let group_index = this.findGroupIndex(value);
		if (group_index >= 0 && group_index < this.groups.length) {
			let group = this.groups[group_index];
			if (OBJECT_VALUE_COLLATOR(value, group.value) === "IDENTICAL") {
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
};

export type LookupWhere<A extends ObjectProperties<A>, B extends string> = {
	[C in keyof Object<A, B>]:
		Object<A, B>[C] extends string | null | undefined ? {
			key: C;
			operator: StringOperator;
			operand: Object<A, B>[C];
		} :
		Object<A, B>[C] extends number | null | undefined ? {
			key: C;
			operator: IntegerOperator;
			operand: Object<A, B>[C];
		} :
		Object<A, B>[C] extends boolean | null | undefined ? {
			key: C;
			operator: BooleanOperator;
			operand: Object<A, B>[C];
		} :
		never;
}[keyof Object<A, B>] | {
	all: LookupWhere<A, B>[];
} | {
	any: LookupWhere<A, B>[];
} | {
	not: LookupWhere<A, B>;
};

export type LookupOrder<A extends ObjectProperties<A>, B extends string> = {
	keys: (keyof Object<A, B>)[];
	sort: "ASC" | "DESC"
};

export type LookupOptions<A extends ObjectProperties<A>, B extends string> = {
	where?: LookupWhere<A, B>;
	order?: LookupOrder<A, B>;
	offset?: number;
	length?: number;
};

export interface ObjectStore<A extends ObjectProperties<A>, B extends string> {
	createObject(properties: A): Promise<Object<A, B>>;
	lookupObject(id: string): Promise<Object<A, B>>;
	lookupObjects(options?: LookupOptions<A, B>): Promise<Array<Object<A, B>>>;
	updateObject(object: Object<A, B>): Promise<Object<A, B>>;
	deleteObject(id: string): Promise<Object<A, B>>;
};

export class VolatileObjectStore<A extends ObjectProperties<A>, B extends string, C extends Array<keyof A>> implements ObjectStore<A, B> {
	protected id: B;
	protected unique_keys: [...C];
	protected guard: autoguard.serialization.MessageGuardBase<Object<A, B>>;
	protected objects: Map<ObjectValue, Object<A, B>>;
	protected indices: Map<keyof A, ObjectIndex<A, B, keyof A>>;

	protected insertIntoIndices(object: Object<A, B>): void {
		for (let [key, index] of this.indices) {
			index.insert(object);
		}
	}

	protected updateObjectIndices(existing_object: Object<A, B>, object: Object<A, B>): void {
		this.removeFromIndices(existing_object);
		this.insertIntoIndices(object);
	}

	protected removeFromIndices(object: Object<A, B>): void {
		for (let [key, index] of this.indices) {
			index.remove(object);
		}
	}

	protected cloneObject(object: Object<A, B>): Object<A, B> {
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

	protected getIndex<C extends keyof A>(key: C): ObjectIndex<A, B, C> {
		let index = this.indices.get(key) as ObjectIndex<A, B, C>;
		if (index == null) {
			index = new ObjectIndex(this.objects.values(), this.id, key);
			this.indices.set(key, index);
		}
		return index;
	}

	protected matchesWhere(object: Object<A, B>, where: Where): boolean {
		if (WhereString.is(where)) {
			let one = object[where.key as keyof Object<A, B>];
			let two = where.operand;
			let collator_result = OBJECT_VALUE_COLLATOR(one, two);
			if (where.operator === "<") {
				return collator_result === "ONE_COMES_FIRST";
			} else if (where.operator === "<=") {
				return collator_result === "ONE_COMES_FIRST" || collator_result === "IDENTICAL";
			} else if (where.operator === "==") {
				return collator_result === "IDENTICAL";
			} else if (where.operator === "!=") {
				return collator_result === "ONE_COMES_FIRST" || collator_result === "TWO_COMES_FIRST";
			} else if (where.operator === ">") {
				return collator_result === "TWO_COMES_FIRST";
			} else if (where.operator === ">=") {
				return collator_result === "TWO_COMES_FIRST" || collator_result === "IDENTICAL";
			} else if (where.operator === "^=") {
				return one != null && two != null && one.startsWith(two);
			} else if (where.operator === "*=") {
				return one != null && two != null && one.includes(two);
			} else if (where.operator === "$=") {
				return one != null && two != null && one.endsWith(two);
			} else {
				let dummy: never = where.operator;
			}
		} else if (WhereInteger.is(where)) {
			let one = object[where.key as keyof Object<A, B>];
			let two = where.operand;
			let collator_result = OBJECT_VALUE_COLLATOR(one, two);
			if (where.operator === "<") {
				return collator_result === "ONE_COMES_FIRST";
			} else if (where.operator === "<=") {
				return collator_result === "ONE_COMES_FIRST" || collator_result === "IDENTICAL";
			} else if (where.operator === "==") {
				return collator_result === "IDENTICAL";
			} else if (where.operator === "!=") {
				return collator_result === "ONE_COMES_FIRST" || collator_result === "TWO_COMES_FIRST";
			} else if (where.operator === ">") {
				return collator_result === "TWO_COMES_FIRST";
			} else if (where.operator === ">=") {
				return collator_result === "TWO_COMES_FIRST" || collator_result === "IDENTICAL";
			} else {
				let dummy: never = where.operator;
			}
		} else if (WhereBoolean.is(where)) {
			let one = object[where.key as keyof Object<A, B>];
			let two = where.operand;
			let collator_result = OBJECT_VALUE_COLLATOR(one, two);
			if (where.operator === "<") {
				return collator_result === "ONE_COMES_FIRST";
			} else if (where.operator === "<=") {
				return collator_result === "ONE_COMES_FIRST" || collator_result === "IDENTICAL";
			} else if (where.operator === "==") {
				return collator_result === "IDENTICAL";
			} else if (where.operator === "!=") {
				return collator_result === "ONE_COMES_FIRST" || collator_result === "TWO_COMES_FIRST";
			} else if (where.operator === ">") {
				return collator_result === "TWO_COMES_FIRST";
			} else if (where.operator === ">=") {
				return collator_result === "TWO_COMES_FIRST" || collator_result === "IDENTICAL";
			} else {
				let dummy: never = where.operator;
			}
		} else if (WhereAll.is(where)) {
			for (let subwhere of where.all) {
				if (!this.matchesWhere(object, subwhere)) {
					return false;
				}
			}
			return true;
		} else if (WhereAny.is(where)) {
			for (let subwhere of where.any) {
				if (this.matchesWhere(object, subwhere)) {
					return true;
				}
			}
			return false;
		} else if (WhereNot.is(where)) {
			return !this.matchesWhere(object, where.not);
		} else {
			let dummy: never = where;
		}
		throw new Error(`Expected code to be unreachable!`);
	}

	constructor(id: B, unique_keys: [...C], guard: autoguard.serialization.MessageGuardBase<Object<A, B>>) {
		this.id = id;
		this.unique_keys = [ ...unique_keys ];
		this.guard = guard;
		this.objects = new Map();
		this.indices = new Map();
	}

	async createObject(properties: A): Promise<Object<A, B>> {
		let id = this.createId();
		let object = this.guard.as({
			[this.id]: id,
			...properties
		});
		for (let unique_key of this.unique_keys) {
			let value = object[unique_key];
			if (value != null) {
				let objects = await this.lookupObjects({
					where: {
						key: unique_key,
						operator: "==",
						operand: value
					} as LookupWhere<A, B> | undefined
				});
				if (objects.length !== 0) {
					throw new ExpectedUniquePropertyError(unique_key, value);
				}
			}
		}
		this.objects.set(id, object);
		this.insertIntoIndices(object);
		return this.cloneObject(object);
	}

	async lookupObject(id: string): Promise<Object<A, B>> {
		let object = this.objects.get(id);
		if (object == null) {
			throw new ExpectedObjectError(this.id, id);
		}
		return this.cloneObject(object);
	}

	async lookupObjects(options?: LookupOptions<A, B>): Promise<Array<Object<A, B>>> {
		options = options ?? {};
		let objects = Array.from(this.objects.values());
		if (options.where != null) {
			let where = options.where;
			objects = objects.filter((object) => {
				return this.matchesWhere(object, where as Where);
			});
		}
		if (options.order != null) {
			let order = options.order;
			objects = objects.sort((one, two) => {
				for (let key of order.keys) {
					let collator_result = OBJECT_VALUE_COLLATOR(one[key], two[key]);
					if (collator_result === "ONE_COMES_FIRST") {
						return order.sort === "ASC" ? -1 : 1;
					}
					if (collator_result === "TWO_COMES_FIRST") {
						return order.sort === "ASC" ? 1 : -1;
					}
				}
				return 0;
			});
		}
		if (options.offset != null) {
			objects = objects.slice(options.offset);
		}
		if (options.length != null) {
			objects = objects.slice(0, options.length);
		}
		return objects.map((object) => this.cloneObject(object));
	}

	async updateObject(object: Object<A, B>): Promise<Object<A, B>> {
		object = this.guard.as(object);
		let id = object[this.id];
		let existing_object = this.objects.get(id);
		if (existing_object == null) {
			throw new ExpectedObjectError(this.id, id);
		}
		for (let unique_key of this.unique_keys) {
			let value = object[unique_key];
			if (value != null) {
				let objects = await this.lookupObjects({
					where: {
						key: unique_key,
						operator: "==",
						operand: value
					} as LookupWhere<A, B> | undefined
				});
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

	async deleteObject(id: string): Promise<Object<A, B>> {
		let object = this.objects.get(id);
		if (object == null) {
			throw new ExpectedObjectError(this.id, id);
		}
		this.objects.delete(id);
		this.removeFromIndices(object);
		return this.cloneObject(object);
	}
};

export type ConnectionLike = {
	query<A>(sql: string, parameters?: Array<ObjectValue>): Promise<A>;
};

export type DatabaseObjectStoreDetail = {
	getConnection(): Promise<ConnectionLike>;
	generateId?(): string;
};

export type DatabaseObjectStoreOptions = {
	use_ansi_quotes?: boolean;
};

export class DatabaseObjectStore<A extends ObjectProperties<A>, B extends string> implements ObjectStore<A, B> {
	protected detail: DatabaseObjectStoreDetail;
	protected table: string;
	protected id: B;
	protected guard: autoguard.serialization.MessageGuardBase<Object<A, B>>;
	protected use_ansi_quotes: boolean;

	protected async createId(): Promise<string> {
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

	protected escapeIdentifier(identifier: string): string {
		if (this.use_ansi_quotes) {
			return `"${identifier.replaceAll("\"", "\"\"")}"`;
		} else {
			if (!/^[a-z_][a-z0-9_]*$/i.test(identifier)) {
				throw new ExpectedSafeIdentifierError(identifier);
			}
			return identifier;
		}
	}

	protected serializeWhere(where: Where): {
		sql: string;
		parameters: Array<ObjectValue>;
	} {
		if (WhereString.is(where)) {
			if (where.operator === "<") {
				return {
					sql: `${this.escapeIdentifier(where.key)} < ?`,
					parameters: [
						where.operand
					]
				};
			} else if (where.operator === "<=") {
				return {
					sql: `${this.escapeIdentifier(where.key)} <= ?`,
					parameters: [
						where.operand
					]
				};
			} else if (where.operator === "==") {
				return {
					sql: `${this.escapeIdentifier(where.key)} ${where.operand == null ? "IS" : "="} ?`,
					parameters: [
						where.operand
					]
				};
			} else if (where.operator === "!=") {
				return {
					sql: `${this.escapeIdentifier(where.key)} ${where.operand == null ? "IS NOT" : "<>"} ?`,
					parameters: [
						where.operand
					]
				};
			} else if (where.operator === ">") {
				return {
					sql: `${this.escapeIdentifier(where.key)} > ?`,
					parameters: [
						where.operand
					]
				};
			} else if (where.operator === ">=") {
				return {
					sql: `${this.escapeIdentifier(where.key)} >= ?`,
					parameters: [
						where.operand
					]
				};
			} else if (where.operator === "^=") {
				return {
					sql: `${this.escapeIdentifier(where.key)} LIKE ? ESCAPE '\\\\'`,
					parameters: [
						where.operand == null ? null : `${where.operand.replace(/[\\%_]/g, (match) => `\\${match}`)}%`
					]
				};
			} else if (where.operator === "*=") {
				return {
					sql: `${this.escapeIdentifier(where.key)} LIKE ? ESCAPE '\\\\'`,
					parameters: [
						where.operand == null ? null : `%${where.operand.replace(/[\\%_]/g, (match) => `\\${match}`)}%`
					]
				};
			} else if (where.operator === "$=") {
				return {
					sql: `${this.escapeIdentifier(where.key)} LIKE ? ESCAPE '\\\\'`,
					parameters: [
						where.operand == null ? null : `%${where.operand.replace(/[\\%_]/g, (match) => `\\${match}`)}`
					]
				};
			} else {
				let dummy: never = where.operator;
			}
		} else if (WhereInteger.is(where)) {
			if (where.operator === "<") {
				return {
					sql: `${this.escapeIdentifier(where.key)} < ?`,
					parameters: [
						where.operand
					]
				};
			} else if (where.operator === "<=") {
				return {
					sql: `${this.escapeIdentifier(where.key)} <= ?`,
					parameters: [
						where.operand
					]
				};
			} else if (where.operator === "==") {
				return {
					sql: `${this.escapeIdentifier(where.key)} ${where.operand == null ? "IS" : "="} ?`,
					parameters: [
						where.operand
					]
				};
			} else if (where.operator === "!=") {
				return {
					sql: `${this.escapeIdentifier(where.key)} ${where.operand == null ? "IS NOT" : "<>"} ?`,
					parameters: [
						where.operand
					]
				};
			} else if (where.operator === ">") {
				return {
					sql: `${this.escapeIdentifier(where.key)} > ?`,
					parameters: [
						where.operand
					]
				};
			} else if (where.operator === ">=") {
				return {
					sql: `${this.escapeIdentifier(where.key)} >= ?`,
					parameters: [
						where.operand
					]
				};
			} else {
				let dummy: never = where.operator;
			}
		} else if (WhereBoolean.is(where)) {
			if (where.operator === "<") {
				return {
					sql: `${this.escapeIdentifier(where.key)} < ?`,
					parameters: [
						where.operand
					]
				};
			} else if (where.operator === "<=") {
				return {
					sql: `${this.escapeIdentifier(where.key)} <= ?`,
					parameters: [
						where.operand
					]
				};
			} else if (where.operator === "==") {
				return {
					sql: `${this.escapeIdentifier(where.key)} ${where.operand == null ? "IS" : "="} ?`,
					parameters: [
						where.operand
					]
				};
			} else if (where.operator === "!=") {
				return {
					sql: `${this.escapeIdentifier(where.key)} ${where.operand == null ? "IS NOT" : "<>"} ?`,
					parameters: [
						where.operand
					]
				};
			} else if (where.operator === ">") {
				return {
					sql: `${this.escapeIdentifier(where.key)} > ?`,
					parameters: [
						where.operand
					]
				};
			} else if (where.operator === ">=") {
				return {
					sql: `${this.escapeIdentifier(where.key)} >= ?`,
					parameters: [
						where.operand
					]
				};
			} else {
				let dummy: never = where.operator;
			}
		} else if (WhereAll.is(where)) {
			let results = where.all.map((where) => this.serializeWhere(where));
			return {
				sql: results.map((result) => `(${result.sql})`).join(" AND ") || "TRUE",
				parameters: results.reduce((parameters, result) => [...parameters, ...result.parameters], [] as Array<ObjectValue>)
			};
		} else if (WhereAny.is(where)) {
			let results = where.any.map((where) => this.serializeWhere(where));
			return {
				sql: results.map((result) => `(${result.sql})`).join(" OR ") || "TRUE",
				parameters: results.reduce((parameters, result) => [...parameters, ...result.parameters], [] as Array<ObjectValue>)
			};
		} else if (WhereNot.is(where)) {
			let result = this.serializeWhere(where.not);
			return {
				sql: `NOT (${result.sql})`,
				parameters: result.parameters
			};
		} else {
			let dummy: never = where;
		}
		throw new Error(`Expected code to be unreachable!`);
	}

	protected serializeOrder(order: Order): {
		sql: Array<string>;
		parameters: Array<ObjectValue>;
	} {
		return {
			sql: order.keys.map((key) => `${this.escapeIdentifier(String(key))} ${order.sort}`).map((line, index, lines) => index < lines.length - 1 ? `${line},` : line),
			parameters: []
		};
	}

	protected serializeLength(length: number | undefined): {
		sql: Array<string>;
		parameters: Array<ObjectValue>;
	} {
		return {
			sql: length == null ? [] : [`LIMIT ${length}`],
			parameters: []
		};
	}

	protected serializeOffset(offset: number | undefined): {
		sql: Array<string>;
		parameters: Array<ObjectValue>;
	} {
		return {
			sql: offset == null ? [] : [`OFFSET ${offset}`],
			parameters: []
		};
	}

	constructor(detail: DatabaseObjectStoreDetail, table: string, id: B, guard: autoguard.serialization.MessageGuardBase<Object<A, B>>, options?: DatabaseObjectStoreOptions) {
		this.detail = detail;
		this.table = table;
		this.id = id;
		this.guard = guard;
		this.use_ansi_quotes = options?.use_ansi_quotes ?? true;
	}

	async createObject(properties: A): Promise<Object<A, B>> {
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
			...Object.values<ObjectValue>(object)
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

	async lookupObject(id: string): Promise<Object<A, B>> {
		let connection = await this.detail.getConnection();
		let objects = await connection.query<Array<Record<string, ObjectValue>>>(`
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

	async lookupObjects(options?: LookupOptions<A, B>): Promise<Object<A, B>[]> {
		let connection = await this.detail.getConnection();
		let where = this.serializeWhere((options?.where ?? { and: [] }) as Where);
		let order = this.serializeOrder((options?.order ?? { keys: [this.id], sort: "ASC" }) as Order);
		let length = this.serializeLength(options?.length);
		let offset = this.serializeOffset(options?.offset);
		let objects = await connection.query<Array<Record<string, ObjectValue>>>(`
			SELECT
				*
			FROM
				${this.escapeIdentifier(this.table)}
			WHERE
				${where.sql}
			ORDER BY
				${order.sql.join("\n				")}
		`
		+ length.sql.join("\n			")
		+ offset.sql.join("\n			"), [
			...where.parameters,
			...order.parameters,
			...length.parameters,
			...offset.parameters
		]);
		return autoguard.guards.Array.of(this.guard).as(objects);
	}

	async updateObject(object: Object<A, B>): Promise<Object<A, B>> {
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
			...Object.values<ObjectValue>(object)
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

	async deleteObject(id: string): Promise<Object<A, B>> {
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
};
