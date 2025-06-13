"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormButton = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
document.head.appendChild(bonsai_1.html.style({}, `
	.form-button {
		background-color: rgb(223, 159, 31);
		border-radius: 4px;
		color: rgb(255, 255, 255);
		cursor: pointer;
		font-family: sans-serif;
		font-size: 14px;
		line-height: 18px;
		padding: 8px 16px;
		transition: all 0.125s;
	}

	.form-button:hover {
		background-color: rgb(239, 175, 47);
	}

	.form-button[disabled] {
		background-color: rgb(95, 95, 95);
		cursor: not-allowed;
	}
`));
function FormButton(managers, attributes, ...children) {
    let enabled = managers.backend.getSubmittable();
    return ((0, Block_1.Block)("button", {
        class: ["form-button"],
        disabled: enabled.compute((enabled) => enabled ? undefined : ""),
        ...attributes
    }, ...children));
}
exports.FormButton = FormButton;
;
