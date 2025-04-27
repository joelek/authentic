import * as libcrypto from "crypto";

export class ChunkFormatError extends Error {
	constructor() {
		super();
	}

	toString(): string {
		return `Expected a chunk with a valid format!`;
	};
};

export class Validator {
	protected cost: number;
	protected block_size: number;
	protected paralellization: number;
	protected salt: Buffer;
	protected hash: Buffer;

	protected constructor(cost: number, block_size: number, paralellization: number, salt: Buffer, hash: Buffer) {
		this.cost = cost;
		this.block_size = block_size;
		this.paralellization = paralellization;
		this.salt = salt;
		this.hash = hash;
	}

	equals(that: Validator): boolean {
		return libcrypto.timingSafeEqual(this.hash, that.hash);
	}

	toChunk(): string {
		let parameters = Buffer.alloc(4);
		parameters[0] = (this.cost >> 8);
		parameters[1] = (this.cost >> 0);
		parameters[2] = (this.block_size >> 0);
		parameters[3] = (this.paralellization >> 0);
		return `$s0$${parameters.toString("hex")}$${this.salt.toString("base64")}$${this.hash.toString("base64")}`;
	}

	verify(passphrase: string): boolean {
		let cost = this.cost;
		let block_size = this.block_size;
		let paralellization = this.paralellization;
		let salt = this.salt;
		let hash = libcrypto.scryptSync(passphrase, salt, 32, {
			N: (1 << cost),
			r: block_size,
			p: paralellization,
			maxmem: (256 << cost) * block_size
		});
		let that = new Validator(cost, block_size, paralellization, salt, hash);
		return this.equals(that);
	}

	static fromChunk(chunk: string): Validator {
		let parts = /^\$s0\$([0-9a-fA-F]{8})\$((?:[0-9a-zA-Z+/]{4})*(?:[0-9a-zA-Z+/]{3}[=]|[0-9a-zA-Z+/]{2}[=][=])?)\$((?:[0-9a-zA-Z+/]{4})*(?:[0-9a-zA-Z+/]{3}[=]|[0-9a-zA-Z+/]{2}[=][=])?)$/.exec(chunk);
		if (parts == null) {
			throw new ChunkFormatError();
		}
		let parameters = Buffer.from(parts[1], "hex");
		let cost = (parameters[0] << 8) | (parameters[1] << 0);
		let block_size = (parameters[2] << 0);
		let paralellization = (parameters[3] << 0);
		let salt = Buffer.from(parts[2], "base64");
		let hash = Buffer.from(parts[3], "base64");
		return new Validator(cost, block_size, paralellization, salt, hash);
	}

	static fromPassphrase(passphrase: string): Validator {
		let cost = 14;
		let block_size = 8;
		let paralellization = 1;
		let salt = libcrypto.randomBytes(16);
		let hash = libcrypto.scryptSync(passphrase, salt, 32, {
			N: (1 << cost),
			r: block_size,
			p: paralellization,
			maxmem: (256 << cost) * block_size
		});
		return new Validator(cost, block_size, paralellization, salt, hash);
	}
};
