import * as libcrypto from "crypto";

export function generateRandomDigits(digits: number): string {
	let count = Math.ceil((Math.log2(10) * digits) / 8);
	let bytes = libcrypto.randomBytes(count);
	let value = BigInt(0);
	for (let i = 0; i < bytes.length; i += 1) {
		value = (value << BigInt(8)) | BigInt(bytes[i]);
	}
	let modulus = BigInt(10) ** BigInt(digits);
	value = value % modulus;
	let string = value.toString().padStart(digits, "0");
	return string;
};
