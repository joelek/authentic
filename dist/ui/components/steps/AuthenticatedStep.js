"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatedStep = void 0;
const api = require("../../../api/client");
const titles_1 = require("../titles");
const Step_1 = require("./Step");
function AuthenticatedStep(managers, attributes) {
    let state = managers.backend.getState();
    let { type, reason } = state.compute((state) => api.AuthenticatedState.is(state) ? state : { type: undefined, reason: undefined });
    return ((0, Step_1.Step)(managers, {
        type,
        reason
    }, (0, titles_1.StepHeaderTitle)(managers, {}, managers.translation.getTranslation("AUTHENTICATE_BUTTON")), (0, titles_1.StepDescriptionTitle)(managers, {}, managers.translation.getStateTranslation(type))));
}
exports.AuthenticatedStep = AuthenticatedStep;
;
