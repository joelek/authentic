"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpectedUnreachableCodeError = exports.getUrlPrefix = void 0;
function getUrlPrefix() {
    return `/auth`;
}
exports.getUrlPrefix = getUrlPrefix;
;
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
