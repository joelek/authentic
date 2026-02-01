import * as autoguard from "@joelek/autoguard";
import { BooleanOperator, IntegerOperator, Operator, Order, StringOperator, Where } from "../prequel";
export declare class ExpectedObjectError extends Error {
    readonly key: ObjectKey;
    readonly value: ObjectValue;
    constructor(key: ObjectKey, value: ObjectValue);
    toString(): string;
}
export declare class ExpectedUniquePropertyError extends Error {
    readonly key: ObjectKey;
    readonly value: ObjectValue;
    constructor(key: ObjectKey, value: ObjectValue);
    toString(): string;
}
export declare class ExpectedSafeIdentifierError extends Error {
    readonly identifer: string;
    constructor(identifer: string);
    toString(): string;
}
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
export declare const OBJECT_VALUE_COLLATOR: Collator<ObjectValue>;
export type Mapper<A, B> = (value: A) => B;
export declare function bisectSortedArray<A, B>(objects: Array<A>, object: A, mapper: Mapper<A, B>, collator: Collator<B>): number;
export type ObjectGroup<A extends ObjectProperties<A>, B extends string, C extends keyof A> = {
    value: A[C];
    objects: Array<Object<A, B>>;
};
export declare class ObjectIndex<A extends ObjectProperties<A>, B extends string, C extends keyof A> {
    protected groups: Array<ObjectGroup<A, B, C>>;
    protected id: B;
    protected key: C;
    protected collectObjects(min_group_index: number, max_group_index: number): Array<Object<A, B>>;
    protected findGroupIndex(value: Object<A, B>[C]): number;
    protected findObjectIndex(objects: Array<Object<A, B>>, object: Object<A, B>): number;
    constructor(objects: Iterable<Object<A, B>>, id: B, key: C);
    insert(object: Object<A, B>): void;
    lookup(operator: Operator, value: Object<A, B>[C]): Array<Object<A, B>>;
    remove(object: Object<A, B>): void;
}
export type LookupWhere<A extends ObjectProperties<A>, B extends string> = {
    [C in keyof Object<A, B>]: Object<A, B>[C] extends string | null | undefined ? {
        key: C;
        operator: StringOperator;
        operand: Object<A, B>[C];
    } : Object<A, B>[C] extends number | null | undefined ? {
        key: C;
        operator: IntegerOperator;
        operand: Object<A, B>[C];
    } : Object<A, B>[C] extends boolean | null | undefined ? {
        key: C;
        operator: BooleanOperator;
        operand: Object<A, B>[C];
    } : never;
}[keyof Object<A, B>] | {
    all: LookupWhere<A, B>[];
} | {
    any: LookupWhere<A, B>[];
} | {
    not: LookupWhere<A, B>;
};
export type LookupOrder<A extends ObjectProperties<A>, B extends string> = {
    keys: (keyof Object<A, B>)[];
    sort: "ASC" | "DESC";
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
}
export declare class VolatileObjectStore<A extends ObjectProperties<A>, B extends string, C extends Array<keyof A>> implements ObjectStore<A, B> {
    protected id: B;
    protected unique_keys: [...C];
    protected guard: autoguard.serialization.MessageGuardBase<Object<A, B>>;
    protected objects: Map<ObjectValue, Object<A, B>>;
    protected indices: Map<keyof A, ObjectIndex<A, B, keyof A>>;
    protected insertIntoIndices(object: Object<A, B>): void;
    protected updateObjectIndices(existing_object: Object<A, B>, object: Object<A, B>): void;
    protected removeFromIndices(object: Object<A, B>): void;
    protected cloneObject(object: Object<A, B>): Object<A, B>;
    protected createId(): string;
    protected getIndex<C extends keyof A>(key: C): ObjectIndex<A, B, C>;
    protected matchesWhere(object: Object<A, B>, where: Where): boolean;
    constructor(id: B, unique_keys: [...C], guard: autoguard.serialization.MessageGuardBase<Object<A, B>>);
    createObject(properties: A): Promise<Object<A, B>>;
    lookupObject(id: string): Promise<Object<A, B>>;
    lookupObjects(options?: LookupOptions<A, B>): Promise<Array<Object<A, B>>>;
    updateObject(object: Object<A, B>): Promise<Object<A, B>>;
    deleteObject(id: string): Promise<Object<A, B>>;
}
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
export declare class DatabaseObjectStore<A extends ObjectProperties<A>, B extends string> implements ObjectStore<A, B> {
    protected detail: DatabaseObjectStoreDetail;
    protected table: string;
    protected id: B;
    protected guard: autoguard.serialization.MessageGuardBase<Object<A, B>>;
    protected use_ansi_quotes: boolean;
    protected createId(): Promise<string>;
    protected escapeIdentifier(identifier: string): string;
    protected serializeWhere(where: Where): {
        sql: string;
        parameters: Array<ObjectValue>;
    };
    protected serializeOrder(order: Order): {
        sql: Array<string>;
        parameters: Array<ObjectValue>;
    };
    protected serializeLength(length: number | undefined): {
        sql: Array<string>;
        parameters: Array<ObjectValue>;
    };
    protected serializeOffset(offset: number | undefined): {
        sql: Array<string>;
        parameters: Array<ObjectValue>;
    };
    constructor(detail: DatabaseObjectStoreDetail, table: string, id: B, guard: autoguard.serialization.MessageGuardBase<Object<A, B>>, options?: DatabaseObjectStoreOptions);
    createObject(properties: A): Promise<Object<A, B>>;
    lookupObject(id: string): Promise<Object<A, B>>;
    lookupObjects(options?: LookupOptions<A, B>): Promise<Object<A, B>[]>;
    updateObject(object: Object<A, B>): Promise<Object<A, B>>;
    deleteObject(id: string): Promise<Object<A, B>>;
}
