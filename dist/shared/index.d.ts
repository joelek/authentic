export declare class ExpectedUnreachableCodeError extends Error {
    constructor();
    toString(): string;
}
export type NullableKeys<A> = {
    [B in keyof A]: null extends A[B] ? B : never;
}[keyof A];
export type Nullable<A> = {
    [B in NullableKeys<A>]: null;
};
