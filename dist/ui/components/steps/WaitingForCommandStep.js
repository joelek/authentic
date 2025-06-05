"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingForCommandStep = void 0;
const bonsai_1 = require("@joelek/bonsai");
const api = require("../../../api/client");
const Step_1 = require("./Step");
function WaitingForCommandStep(managers, attributes) {
    let state = managers.backend.getState();
    let { type, reason } = state.compute((state) => api.WaitingForCommandState.is(state) ? state : {});
    let disabled = managers.backend.getPending().compute((pending) => pending ? "" : undefined);
    return ((0, Step_1.Step)(managers, {
        type,
        reason
    }, bonsai_1.html.button({
        disabled,
        onclick: async () => {
            await managers.backend.sendCommand({
                payload: {
                    command: {
                        type: "REGISTER"
                    }
                }
            });
        }
    }, bonsai_1.html.p({}, managers.translation.getTranslation("REGISTER_BUTTON"))), bonsai_1.html.button({
        disabled,
        onclick: async () => {
            await managers.backend.sendCommand({
                payload: {
                    command: {
                        type: "AUTHENTICATE"
                    }
                }
            });
        }
    }, bonsai_1.html.p({}, managers.translation.getTranslation("AUTHENTICATE_BUTTON"))), bonsai_1.html.button({
        disabled,
        onclick: async () => {
            await managers.backend.sendCommand({
                payload: {
                    command: {
                        type: "RECOVER"
                    }
                }
            });
        }
    }, bonsai_1.html.p({}, managers.translation.getTranslation("RECOVER_BUTTON")))));
}
exports.WaitingForCommandStep = WaitingForCommandStep;
;
