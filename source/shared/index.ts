export class ExpectedUnreachableCodeError extends Error {
	constructor() {
		super();
	}

	toString(): string {
		return `Expected code to be unreachable!`;
	}
};

export type NullableKeys<A> = {
	[B in keyof A]: null extends A[B] ? B : never;
}[keyof A];

export type Nullable<A> = {
	[B in NullableKeys<A>]: null;
};
