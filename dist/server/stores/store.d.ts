import * as autoguard from "@joelek/autoguard";
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
export declare const OBJECT_VALUE_COLLATOR: Collator<ObjectValue>;
export type Mapper<A, B> = (value: A) => B;
export declare function bisectSortedArray<A, B>(objects: Array<A>, object: A, mapper: Mapper<A, B>, collator: Collator<B>): number;
export type ObjectGroup<A extends ObjectProperties<A>, B extends keyof A> = {
    value: A[B];
    objects: Array<Object<A>>;
};
export type Operator = ">" | ">=" | "=" | "<" | "<=";
export declare class ObjectIndex<A extends ObjectProperties<A>, B extends keyof A> {
    protected groups: Array<ObjectGroup<Object<A>, B>>;
    protected key: B;
    protected collectObjects(min_group_index: number, max_group_index: number): Array<Object<A>>;
    protected findGroupIndex(value: Object<A>[B]): number;
    protected findObjectIndex(objects: Array<Object<A>>, object: Object<A>): number;
    constructor(objects: Iterable<Object<A>>, key: B);
    insert(object: Object<A>): void;
    lookup(operator: Operator, value: Object<A>[B]): Array<Object<A>>;
    remove(object: Object<A>): void;
}
export interface ObjectStore<A extends ObjectProperties<A>> {
    createObject(properties: A): Promise<Object<A>>;
    lookupObject(id: string): Promise<Object<A>>;
    lookupObjects<C extends keyof A>(key: C, operator: Operator, value: Object<A>[C]): Promise<Array<Object<A>>>;
    updateObject(object: Object<A>): Promise<Object<A>>;
    deleteObject(id: string): Promise<Object<A>>;
}
export declare class VolatileObjectStore<A extends ObjectProperties<A>, B extends Array<keyof A>> implements ObjectStore<A> {
    protected unique_keys: [...B];
    protected objects: Map<string, Object<A>>;
    protected indices: Map<keyof A, ObjectIndex<A, keyof A>>;
    protected insertIntoIndices(object: Object<A>): void;
    protected updateObjectIndices(existing_object: Object<A>, object: Object<A>): void;
    protected removeFromIndices(object: Object<A>): void;
    protected cloneObject(object: Object<A>): Object<A>;
    protected createId(): string;
    protected getIndex<C extends keyof A>(key: C): ObjectIndex<A, C>;
    constructor(unique_keys: [...B]);
    createObject(properties: A): Promise<Object<A>>;
    lookupObject(id: string): Promise<Object<A>>;
    lookupObjects<C extends keyof A>(key: C, operator: Operator, value: Object<A>[C]): Promise<Array<Object<A>>>;
    updateObject(object: Object<A>): Promise<Object<A>>;
    deleteObject(id: string): Promise<Object<A>>;
}
export type ConnectionLike = {
    query<A>(sql: string, parameters?: Array<ObjectValue>): Promise<A>;
};
export type ConnectionProvider = {
    (): Promise<ConnectionLike>;
};
export declare class DatabaseObjectStore<A extends ObjectProperties<A>> implements ObjectStore<A> {
    protected connection_provider: ConnectionProvider;
    protected table: string;
    protected guard: autoguard.serialization.MessageGuardBase<Object<A>>;
    protected createId(): Promise<string>;
    protected escapeIdentifier(identifier: string): string;
    constructor(connection_provider: ConnectionProvider, table: string, guard: autoguard.serialization.MessageGuardBase<Object<A>>);
    createObject(properties: A): Promise<Object<A>>;
    lookupObject(id: string): Promise<Object<A>>;
    lookupObjects<C extends keyof A>(key: C, operator: Operator, value: Object<A>[C]): Promise<Object<A>[]>;
    updateObject(object: Object<A>): Promise<Object<A>>;
    deleteObject(id: string): Promise<Object<A>>;
}
