"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatedStep = void 0;
const bonsai_1 = require("@joelek/bonsai");
const api = require("../../../api");
const Step_1 = require("./Step");
function AuthenticatedStep(managers, attributes) {
    let state = managers.backend.getState();
    let { type, reason } = state.compute((state) => api.WaitingForCommandState.is(state) ? state : {});
    let disabled = managers.backend.getPending().compute((pending) => pending ? "" : undefined);
    return ((0, Step_1.Step)(managers, {
        type,
        reason
    }, bonsai_1.html.p({}, managers.translation.getTranslation("AUTHENTICATED_TEXT"))));
}
exports.AuthenticatedStep = AuthenticatedStep;
;
