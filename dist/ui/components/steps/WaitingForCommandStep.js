"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingForCommandStep = void 0;
const api = require("../../../api/client");
const FormButton_1 = require("../form/FormButton");
const FormGroup_1 = require("../form/FormGroup");
const ButtonTitle_1 = require("../titles/ButtonTitle");
const StepDescriptionTitle_1 = require("../titles/StepDescriptionTitle");
const StepHeaderTitle_1 = require("../titles/StepHeaderTitle");
const Step_1 = require("./Step");
function WaitingForCommandStep(managers, attributes) {
    let state = managers.backend.getState();
    let { type, reason } = state.compute((state) => api.WaitingForCommandState.is(state) ? state : { type: undefined, reason: undefined });
    return ((0, Step_1.Step)(managers, {
        type,
        reason
    }, (0, StepHeaderTitle_1.StepHeaderTitle)(managers, {}, managers.translation.getTranslation("MANAGE_ACCOUNT")), (0, StepDescriptionTitle_1.StepDescriptionTitle)(managers, {}, managers.translation.getStateTranslation(type)), (0, FormGroup_1.FormGroup)(managers, {}, (0, FormButton_1.FormButton)(managers, {
        onclick: async () => {
            await managers.backend.sendCommand({
                headers: {
                    "x-preferred-language": managers.translation.getLanguage().value()
                },
                payload: {
                    command: {
                        type: "REGISTER"
                    }
                }
            });
        }
    }, (0, ButtonTitle_1.ButtonTitle)(managers, {}, managers.translation.getTranslation("REGISTER_ACCOUNT"))), (0, FormButton_1.FormButton)(managers, {
        onclick: async () => {
            await managers.backend.sendCommand({
                headers: {
                    "x-preferred-language": managers.translation.getLanguage().value()
                },
                payload: {
                    command: {
                        type: "AUTHENTICATE"
                    }
                }
            });
        }
    }, (0, ButtonTitle_1.ButtonTitle)(managers, {}, managers.translation.getTranslation("AUTHENTICATE_ACCOUNT"))), (0, FormButton_1.FormButton)(managers, {
        onclick: async () => {
            await managers.backend.sendCommand({
                headers: {
                    "x-preferred-language": managers.translation.getLanguage().value()
                },
                payload: {
                    command: {
                        type: "RECOVER"
                    }
                }
            });
        }
    }, (0, ButtonTitle_1.ButtonTitle)(managers, {}, managers.translation.getTranslation("RECOVER_ACCOUNT"))))));
}
exports.WaitingForCommandStep = WaitingForCommandStep;
;
