"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingForAuthenticateUsernameStep = void 0;
const bonsai_1 = require("@joelek/bonsai");
const api = require("../../../api/client");
const Step_1 = require("./Step");
function WaitingForAuthenticateUsernameStep(managers, attributes) {
    let state = managers.backend.getState();
    let { type, reason } = state.compute((state) => api.WaitingForAuthenticateUsernameState.is(state) ? state : { type: undefined, reason: undefined });
    let editable = managers.backend.getEditable().compute((editable) => editable ? undefined : "");
    let submittable = managers.backend.getSubmittable().compute((submittable) => submittable ? undefined : "");
    let value = (0, bonsai_1.stateify)("");
    return ((0, Step_1.Step)(managers, {
        type,
        reason
    }, bonsai_1.html.input({
        disabled: editable,
        value
    }), bonsai_1.html.button({
        disabled: submittable,
        onclick: async () => {
            await managers.backend.sendCommand({
                payload: {
                    command: {
                        type: "AUTHENTICATE_USERNAME",
                        username: value.value()
                    }
                }
            });
        }
    }, bonsai_1.html.p({}, managers.translation.getTranslation("CONTINUE_BUTTON")))));
}
exports.WaitingForAuthenticateUsernameStep = WaitingForAuthenticateUsernameStep;
;
