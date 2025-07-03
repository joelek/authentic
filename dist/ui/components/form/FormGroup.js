"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormGroup = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
const CLASS_NAME = "authentic-form-group";
document.head.appendChild(bonsai_1.html.style({}, `
	.${CLASS_NAME} {
		display: grid;
		gap: 12px;
	}
`));
function FormGroup(managers, { ...augmentations }, ...children) {
    return ((0, Block_1.Block)("form", {
        class: [`${CLASS_NAME}`]
    }, ...children).augment(augmentations));
}
exports.FormGroup = FormGroup;
;
