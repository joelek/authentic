"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingForRecoverTokenStep = void 0;
const bonsai_1 = require("@joelek/bonsai");
const api = require("../../../api/client");
const CancelButton_1 = require("../buttons/CancelButton");
const form_1 = require("../form");
const titles_1 = require("../titles");
const Step_1 = require("./Step");
function WaitingForRecoverTokenStep(managers, attributes) {
    let state = managers.backend.getState();
    let { type, reason } = state.compute((state) => api.WaitingForRecoverTokenState.is(state) ? state : { type: undefined, reason: undefined });
    let value = (0, bonsai_1.stateify)("");
    let input = (0, form_1.FormInput)(managers, {
        type: "text",
        placeholder: managers.translation.getTranslation("TOKEN_PLACEHOLDER"),
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
    }, (0, titles_1.StepHeaderTitle)(managers, {}, managers.translation.getTranslation("RECOVER_ACCOUNT")), (0, titles_1.StepDescriptionTitle)(managers, {}, managers.translation.getStateTranslation(type)), (0, form_1.FormGroup)(managers, {}, input, (0, form_1.FormButton)(managers, {
        onclick: async () => {
            await managers.backend.sendCommand({
                payload: {
                    command: {
                        type: "RECOVER_TOKEN",
                        token: value.value()
                    }
                }
            });
            if (type.value() != null) {
                input.focus();
            }
        }
    }, (0, titles_1.ButtonTitle)(managers, {}, managers.translation.getTranslation("CONTINUE")))), (0, titles_1.StepDescriptionTitle)(managers, {}, managers.translation.getStateTranslation(reason)), (0, CancelButton_1.CancelButton)(managers, {})));
}
exports.WaitingForRecoverTokenStep = WaitingForRecoverTokenStep;
;
