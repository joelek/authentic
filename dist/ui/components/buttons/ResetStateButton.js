"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetStateButton = void 0;
const bonsai_1 = require("@joelek/bonsai");
function ResetStateButton(managers, attributes) {
    let submittable = managers.backend.getSubmittable().compute((submittable) => submittable ? undefined : "");
    return (bonsai_1.html.button({
        disabled: submittable,
        onclick: async () => {
            await managers.backend.sendCommand({
                payload: {
                    command: {
                        type: "RESET_STATE"
                    }
                }
            });
        }
    }, bonsai_1.html.p({}, managers.translation.getTranslation("RESET_STATE_BUTTON"))));
}
exports.ResetStateButton = ResetStateButton;
;
