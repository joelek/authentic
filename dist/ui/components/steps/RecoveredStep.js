"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoveredStep = void 0;
const bonsai_1 = require("@joelek/bonsai");
const api = require("../../../api/client");
const Step_1 = require("./Step");
function RecoveredStep(managers, attributes) {
    let state = managers.backend.getState();
    let { type, reason } = state.compute((state) => api.WaitingForCommandState.is(state) ? state : {});
    let disabled = managers.backend.getPending().compute((pending) => pending ? "" : undefined);
    return ((0, Step_1.Step)(managers, {
        type,
        reason
    }, bonsai_1.html.p({}, managers.translation.getTranslation("RECOVERED_TEXT"))));
}
exports.RecoveredStep = RecoveredStep;
;
