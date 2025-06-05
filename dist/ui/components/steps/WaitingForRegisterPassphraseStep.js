"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingForRegisterPassphraseStep = void 0;
const bonsai_1 = require("@joelek/bonsai");
const api = require("../../../api/client");
const Step_1 = require("./Step");
function WaitingForRegisterPassphraseStep(managers, attributes) {
    let state = managers.backend.getState();
    let { type, reason } = state.compute((state) => api.WaitingForRegisterPassphraseState.is(state) ? state : {});
    let disabled = managers.backend.getPending().compute((pending) => pending ? "" : undefined);
    let value = (0, bonsai_1.stateify)("");
    return ((0, Step_1.Step)(managers, {
        type,
        reason
    }, bonsai_1.html.input({
        disabled,
        value
    }), bonsai_1.html.button({
        disabled,
        onclick: async () => {
            await managers.backend.sendCommand({
                payload: {
                    command: {
                        type: "REGISTER_PASSPHRASE",
                        passphrase: value.value()
                    }
                }
            });
        }
    }, bonsai_1.html.p({}, managers.translation.getTranslation("CONTINUE_BUTTON")))));
}
exports.WaitingForRegisterPassphraseStep = WaitingForRegisterPassphraseStep;
;
