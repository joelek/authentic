"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingForCommandStep = void 0;
const api = require("../../../api/client");
const form_1 = require("../form");
const titles_1 = require("../titles");
const Step_1 = require("./Step");
function WaitingForCommandStep(managers, attributes) {
    let state = managers.backend.getState();
    let { type, reason } = state.compute((state) => api.WaitingForCommandState.is(state) ? state : { type: undefined, reason: undefined });
    return ((0, Step_1.Step)(managers, {
        type,
        reason
    }, (0, form_1.FormGroup)(managers, {}, (0, form_1.FormButton)(managers, {
        onclick: async () => {
            await managers.backend.sendCommand({
                payload: {
                    command: {
                        type: "REGISTER"
                    }
                }
            });
        }
    }, (0, titles_1.ButtonTitle)(managers, {}, managers.translation.getTranslation("REGISTER_BUTTON"))), (0, form_1.FormButton)(managers, {
        onclick: async () => {
            await managers.backend.sendCommand({
                payload: {
                    command: {
                        type: "AUTHENTICATE"
                    }
                }
            });
        }
    }, (0, titles_1.ButtonTitle)(managers, {}, managers.translation.getTranslation("AUTHENTICATE_BUTTON"))), (0, form_1.FormButton)(managers, {
        onclick: async () => {
            await managers.backend.sendCommand({
                payload: {
                    command: {
                        type: "RECOVER"
                    }
                }
            });
        }
    }, (0, titles_1.ButtonTitle)(managers, {}, managers.translation.getTranslation("RECOVER_BUTTON"))))));
}
exports.WaitingForCommandStep = WaitingForCommandStep;
;
