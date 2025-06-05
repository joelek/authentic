"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpectedUnreachableCodeError = exports.getUrlPrefix = void 0;
function getUrlPrefix(namespace) {
    return namespace ? `/${encodeURIComponent(namespace)}` : "";
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
