"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormInput = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
const CLASS_NAME = "authentic-form-input";
document.head.appendChild(bonsai_1.html.style({}, `
	.${CLASS_NAME} {
		background-color: rgb(63, 63, 63);
		border-radius: 4px;
		color: rgb(255, 255, 255);
		font-family: sans-serif;
		font-size: 14px;
		height: 32px;
		line-height: 20px;
		padding: 6px;
		transition: background-color 0.125s, border-color 0.125s, color 0.125s;
	}

	.${CLASS_NAME}:hover {
		background-color: rgb(79, 79, 79);
	}

	.${CLASS_NAME}:focus {
		background-color: rgb(79, 79, 79);
	}

	.${CLASS_NAME}[readonly] {
		cursor: not-allowed;
	}
`));
function FormInput(managers, { ...augmentations }) {
    let enabled = managers.backend.getEditable();
    return ((0, Block_1.Block)("input", {
        class: [`${CLASS_NAME}`],
        readonly: enabled.compute((enabled) => enabled ? undefined : ""),
        spellcheck: false
    }).augment(augmentations));
}
exports.FormInput = FormInput;
;
