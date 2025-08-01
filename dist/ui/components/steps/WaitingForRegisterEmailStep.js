"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingForRegisterEmailStep = void 0;
const bonsai_1 = require("@joelek/bonsai");
const api = require("../../../api/client");
const RestartButton_1 = require("../buttons/RestartButton");
const FormButton_1 = require("../form/FormButton");
const FormGroup_1 = require("../form/FormGroup");
const FormInput_1 = require("../form/FormInput");
const ButtonTitle_1 = require("../titles/ButtonTitle");
const StepDescriptionTitle_1 = require("../titles/StepDescriptionTitle");
const StepHeaderTitle_1 = require("../titles/StepHeaderTitle");
const Step_1 = require("./Step");
function WaitingForRegisterEmailStep(managers, attributes) {
    let state = managers.backend.getState();
    let { type, reason } = state.compute((state) => api.WaitingForRegisterEmailState.is(state) ? state : { type: undefined, reason: undefined });
    let value = (0, bonsai_1.stateify)("");
    let input = (0, FormInput_1.FormInput)(managers, {
        type: "email",
        placeholder: managers.translation.getTranslation("EMAIL_PLACEHOLDER"),
        value
    });
    type.compute((type) => {
        if (type != null) {
            input.focus();
        }
        else {
            value.update("");
        }
    });
    return ((0, Step_1.Step)(managers, {
        type,
        reason
    }, (0, StepHeaderTitle_1.StepHeaderTitle)(managers, {}, managers.translation.getTranslation("REGISTER_ACCOUNT")), (0, StepDescriptionTitle_1.StepDescriptionTitle)(managers, {}, managers.translation.getStateTranslation(type)), (0, FormGroup_1.FormGroup)(managers, {}, input, (0, FormButton_1.FormButton)(managers, {
        onclick: async () => {
            await managers.backend.sendCommand({
                headers: {
                    "x-preferred-language": managers.translation.getLanguage().value()
                },
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
    }, (0, ButtonTitle_1.ButtonTitle)(managers, {}, managers.translation.getTranslation("CONTINUE")))), (0, StepDescriptionTitle_1.StepDescriptionTitle)(managers, {}, managers.translation.getStateTranslation(reason)), (0, RestartButton_1.RestartButton)(managers, {})));
}
exports.WaitingForRegisterEmailStep = WaitingForRegisterEmailStep;
;
