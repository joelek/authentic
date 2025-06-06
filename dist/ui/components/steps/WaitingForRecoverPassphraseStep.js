"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingForRecoverPassphraseStep = void 0;
const bonsai_1 = require("@joelek/bonsai");
const api = require("../../../api/client");
const titles_1 = require("../titles");
const Step_1 = require("./Step");
function WaitingForRecoverPassphraseStep(managers, attributes) {
    let state = managers.backend.getState();
    let { type, reason } = state.compute((state) => api.WaitingForRecoverPassphraseState.is(state) ? state : { type: undefined, reason: undefined });
    let editable = managers.backend.getEditable().compute((editable) => editable ? undefined : "");
    let submittable = managers.backend.getSubmittable().compute((submittable) => submittable ? undefined : "");
    let value = (0, bonsai_1.stateify)("");
    let input = bonsai_1.html.input({
        disabled: editable,
        value
    });
    return ((0, Step_1.Step)(managers, {
        type,
        reason
    }, (0, titles_1.StepTitle)(managers, {}, managers.translation.getTranslation("RECOVER_BUTTON")), input, bonsai_1.html.button({
        disabled: submittable,
        onclick: async () => {
            await managers.backend.sendCommand({
                payload: {
                    command: {
                        type: "RECOVER_PASSPHRASE",
                        passphrase: value.value()
                    }
                }
            });
            if (type.value() != null) {
                input.focus();
            }
        }
    }, bonsai_1.html.p({}, managers.translation.getTranslation("CONTINUE_BUTTON")))));
}
exports.WaitingForRecoverPassphraseStep = WaitingForRecoverPassphraseStep;
;
