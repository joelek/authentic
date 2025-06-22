"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomDigits = void 0;
const libcrypto = require("crypto");
function generateRandomDigits(digits) {
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
}
exports.generateRandomDigits = generateRandomDigits;
;
