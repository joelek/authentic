"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormGroup = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
document.head.appendChild(bonsai_1.html.style({}, `\
	.form-group {
		display: grid;
		gap: 12px;
	}
`));
function FormGroup(managers, attributes, ...children) {
    return ((0, Block_1.Block)("div", {
        class: ["form-group"],
        ...attributes
    }, ...children));
}
exports.FormGroup = FormGroup;
;
