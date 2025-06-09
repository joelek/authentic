"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingForRegisterEmailStep = void 0;
const bonsai_1 = require("@joelek/bonsai");
const api = require("../../../api/client");
const ResetStateButton_1 = require("../buttons/ResetStateButton");
const form_1 = require("../form");
const titles_1 = require("../titles");
const Step_1 = require("./Step");
function WaitingForRegisterEmailStep(managers, attributes) {
    let state = managers.backend.getState();
    let { type, reason } = state.compute((state) => api.WaitingForRegisterEmailState.is(state) ? state : { type: undefined, reason: undefined });
    let value = (0, bonsai_1.stateify)("");
    let input = (0, form_1.FormInput)(managers, {
        type: "email",
        placeholder: managers.translation.getTranslation("EMAIL_PLACEHOLDER"),
        value
    });
    type.compute((type) => {
        if (type != null) {
            input.focus();
        }
    });
    return ((0, Step_1.Step)(managers, {
        type,
        reason
    }, (0, titles_1.StepHeaderTitle)(managers, {}, managers.translation.getTranslation("REGISTER_BUTTON")), (0, titles_1.StepDescriptionTitle)(managers, {}, managers.translation.getStateTranslation(type)), (0, form_1.FormGroup)(managers, {}, input, (0, form_1.FormButton)(managers, {
        onclick: async () => {
            await managers.backend.sendCommand({
                payload: {
                    command: {
                        type: "REGISTER_EMAIL",
                        email: value.value()
                    }
                }
            });
            if (type.value() != null) {
                input.focus();
            }
        }
    }, (0, titles_1.ButtonTitle)(managers, {}, managers.translation.getTranslation("CONTINUE_BUTTON")))), (0, titles_1.StepDescriptionTitle)(managers, {}, managers.translation.getStateTranslation(reason)), (0, ResetStateButton_1.ResetStateButton)(managers, {})));
}
exports.WaitingForRegisterEmailStep = WaitingForRegisterEmailStep;
;
