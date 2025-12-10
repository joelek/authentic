"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloseWindowButton = void 0;
const FormButton_1 = require("../form/FormButton");
const ButtonTitle_1 = require("../titles/ButtonTitle");
function CloseWindowButton(managers, attributes) {
    return ((0, FormButton_1.FormButton)(managers, {
        enabled: managers.backend.getSubmittable(),
        primary: true,
        onclick: async () => {
            managers.state.visible.update(false);
        }
    }, (0, ButtonTitle_1.ButtonTitle)(managers, {}, managers.translation.getTranslation("CLOSE_WINDOW"))));
}
exports.CloseWindowButton = CloseWindowButton;
;
