import { guards } from "@joelek/autoguard";
export declare const Language: guards.UnionGuard<["en", "sv"]>;
export type Language = ReturnType<typeof Language["as"]>;
export declare class ExpectedUnreachableCodeError extends Error {
    constructor();
    toString(): string;
}
