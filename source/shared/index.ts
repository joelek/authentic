import { guards } from "@joelek/autoguard";

export const Language = guards.Union.of(
	guards.StringLiteral.of("en"),
	guards.StringLiteral.of("sv")
);

export type Language = ReturnType<typeof Language["as"]>;

export class ExpectedUnreachableCodeError extends Error {
	constructor() {
		super();
	}

	toString(): string {
		return `Expected code to be unreachable!`;
	}
};
