"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisteredStep = void 0;
const api = require("../../../api/client");
const buttons_1 = require("../buttons");
const form_1 = require("../form");
const titles_1 = require("../titles");
const Step_1 = require("./Step");
function RegisteredStep(managers, attributes) {
    let state = managers.backend.getState();
    let { type, reason } = state.compute((state) => api.RegisteredState.is(state) ? state : { type: undefined, reason: undefined });
    let user = managers.backend.getUser();
    let { id, email, username } = user.compute((user) => user != null ? user : { id: undefined, email: undefined, username: undefined });
    return ((0, Step_1.Step)(managers, {
        type,
        reason
    }, (0, titles_1.StepHeaderTitle)(managers, {}, managers.translation.getTranslation("REGISTER_BUTTON")), (0, titles_1.StepDescriptionTitle)(managers, {}, managers.translation.getStateTranslation(type)), (0, form_1.FormGroup)(managers, {}, (0, titles_1.StepDescriptionTitle)(managers, {}, email), (0, buttons_1.LogOutButton)(managers, {}))));
}
exports.RegisteredStep = RegisteredStep;
;
