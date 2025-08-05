"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconButton = void 0;
const FormButton_1 = require("../form/FormButton");
const Icon_1 = require("../Icon");
function IconButton(managers, { graphic, ...rest }) {
    return ((0, FormButton_1.FormButton)(managers, rest, (0, Icon_1.Icon)(managers, {
        graphic: graphic,
        size: "20px"
    })));
}
exports.IconButton = IconButton;
;
