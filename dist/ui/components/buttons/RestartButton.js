"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestartButton = void 0;
const FormButton_1 = require("../form/FormButton");
const ButtonTitle_1 = require("../titles/ButtonTitle");
function RestartButton(managers, attributes) {
    return ((0, FormButton_1.FormButton)(managers, {
        enabled: managers.backend.getSubmittable(),
        onclick: async () => {
            await managers.backend.sendCommand({
                headers: {
                    "x-preferred-language": managers.translation.getLanguage().value()
                },
                payload: {
                    command: {
                        type: "RESET_STATE"
                    }
                }
            });
        }
    }, (0, ButtonTitle_1.ButtonTitle)(managers, {}, managers.translation.getTranslation("RESTART"))));
}
exports.RestartButton = RestartButton;
;
