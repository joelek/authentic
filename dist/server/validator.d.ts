/// <reference types="node" />
/// <reference types="node" />
export declare class ChunkFormatError extends Error {
    constructor();
    toString(): string;
}
export declare class Validator {
    protected cost: number;
    protected block_size: number;
    protected paralellization: number;
    protected salt: Buffer;
    protected hash: Buffer;
    protected constructor(cost: number, block_size: number, paralellization: number, salt: Buffer, hash: Buffer);
    equals(that: Validator): boolean;
    toChunk(): string;
    verify(passphrase: string): boolean;
    static fromChunk(chunk: string): Validator;
    static fromPassphrase(passphrase: string): Validator;
}
