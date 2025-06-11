"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelButton = void 0;
const FormButton_1 = require("../form/FormButton");
const titles_1 = require("../titles");
function CancelButton(managers, attributes) {
    return ((0, FormButton_1.FormButton)(managers, {
        onclick: async () => {
            await managers.backend.sendCommand({
                payload: {
                    command: {
                        type: "RESET_STATE"
                    }
                }
            });
        }
    }, (0, titles_1.ButtonTitle)(managers, {}, managers.translation.getTranslation("CANCEL_BUTTON"))));
}
exports.CancelButton = CancelButton;
;
