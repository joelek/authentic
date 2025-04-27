export function getUrlPrefix(namespace: string | undefined): string {
	return namespace ? `/${encodeURIComponent(namespace)}` : "";
};

export class ExpectedUnreachableCodeError extends Error {
	constructor() {
		super();
	}

	toString(): string {
		return `Expected code to be unreachable!`;
	}
};
