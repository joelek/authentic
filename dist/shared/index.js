"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpectedUnreachableCodeError = exports.Language = void 0;
const autoguard_1 = require("@joelek/autoguard");
exports.Language = autoguard_1.guards.Union.of(autoguard_1.guards.StringLiteral.of("en"), autoguard_1.guards.StringLiteral.of("sv"));
class ExpectedUnreachableCodeError extends Error {
    constructor() {
        super();
    }
    toString() {
        return `Expected code to be unreachable!`;
    }
}
exports.ExpectedUnreachableCodeError = ExpectedUnreachableCodeError;
;
