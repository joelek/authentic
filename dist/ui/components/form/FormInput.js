"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormInput = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
document.head.appendChild(bonsai_1.html.style({}, `\
	.form-input {
		background-color: rgb(63, 63, 63);
		border-radius: 4px;
		color: rgb(255, 255, 255);
		font-family: sans-serif;
		font-size: 14px;
		line-height: 18px;
		padding: 8px;
		transition: all 0.125s;
	}

	.form-input:focus {
		background-color: rgb(79, 79, 79);
	}

	.form-input[readonly] {
		cursor: not-allowed;
	}
`));
function FormInput(managers, attributes) {
    let enabled = managers.backend.getEditable();
    return ((0, Block_1.Block)("input", {
        class: ["form-input"],
        readonly: enabled.compute((enabled) => enabled ? undefined : ""),
        spellcheck: false,
        ...attributes
    }));
}
exports.FormInput = FormInput;
;
