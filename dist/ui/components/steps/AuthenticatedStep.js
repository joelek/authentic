"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatedStep = void 0;
const bonsai_1 = require("@joelek/bonsai");
const api = require("../../../api/client");
const titles_1 = require("../titles");
const Step_1 = require("./Step");
function AuthenticatedStep(managers, attributes) {
    let state = managers.backend.getState();
    let { type, reason } = state.compute((state) => api.AuthenticatedState.is(state) ? state : { type: undefined, reason: undefined });
    let editable = managers.backend.getEditable().compute((editable) => editable ? undefined : "");
    let submittable = managers.backend.getSubmittable().compute((submittable) => submittable ? undefined : "");
    return ((0, Step_1.Step)(managers, {
        type,
        reason
    }, (0, titles_1.StepTitle)(managers, {}, managers.translation.getTranslation("AUTHENTICATE_BUTTON")), bonsai_1.html.p({}, managers.translation.getTranslation("AUTHENTICATED_TEXT"))));
}
exports.AuthenticatedStep = AuthenticatedStep;
;
