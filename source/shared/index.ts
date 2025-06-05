export function getUrlPrefix(): string {
	return `/auth`;
};

export class ExpectedUnreachableCodeError extends Error {
	constructor() {
		super();
	}

	toString(): string {
		return `Expected code to be unreachable!`;
	}
};
