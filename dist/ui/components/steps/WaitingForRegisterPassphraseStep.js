"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingForRegisterPassphraseStep = void 0;
const bonsai_1 = require("@joelek/bonsai");
const api = require("../../../api/client");
const FormButton_1 = require("../form/FormButton");
const FormGroup_1 = require("../form/FormGroup");
const FormInput_1 = require("../form/FormInput");
const ButtonTitle_1 = require("../titles/ButtonTitle");
const StepDescriptionTitle_1 = require("../titles/StepDescriptionTitle");
const StepHeaderTitle_1 = require("../titles/StepHeaderTitle");
const Step_1 = require("./Step");
function WaitingForRegisterPassphraseStep(managers, attributes) {
    let state = managers.backend.getState();
    let { type, reason } = state.compute((state) => api.WaitingForRegisterPassphraseState.is(state) ? state : { type: undefined, reason: undefined });
    let value = (0, bonsai_1.stateify)("");
    let input = (0, FormInput_1.FormInput)(managers, {
        type: "password",
        enabled: managers.backend.getEditable(),
        placeholder: managers.translation.getTranslation("PASSPHRASE_PLACEHOLDER"),
        value
    });
    return ((0, Step_1.Step)(managers, {
        type,
        reason,
        ontransition: (state) => {
            if (state === "start") {
                value.update("");
            }
            else {
                input.focus();
            }
        }
    }, (0, StepHeaderTitle_1.StepHeaderTitle)(managers, {}, managers.translation.getTranslation("REGISTER_ACCOUNT")), (0, StepDescriptionTitle_1.StepDescriptionTitle)(managers, {}, managers.translation.getStateTranslation(type)), (0, FormGroup_1.FormGroup)(managers, {}, input, (0, FormButton_1.FormButton)(managers, {
        enabled: managers.backend.getSubmittable(),
        primary: true,
        onclick: async () => {
            await managers.backend.sendCommand({
                headers: {
                    "x-preferred-language": managers.translation.getLanguage().value()
                },
                payload: {
                    command: {
                        type: "REGISTER_PASSPHRASE",
                        passphrase: value.value()
                    }
                }
            });
            if (type.value() != null) {
                input.focus();
            }
        }
    }, (0, ButtonTitle_1.ButtonTitle)(managers, {}, managers.translation.getTranslation("CONTINUE")))), (0, StepDescriptionTitle_1.StepDescriptionTitle)(managers, {}, managers.translation.getStateTranslation(reason))));
}
exports.WaitingForRegisterPassphraseStep = WaitingForRegisterPassphraseStep;
;
