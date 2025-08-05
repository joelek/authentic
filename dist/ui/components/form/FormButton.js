"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormButton = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
const CLASS_NAME = "authentic-form-button";
document.head.appendChild(bonsai_1.html.style({}, `
	.${CLASS_NAME} {
		background-color: var(--authentic-accent-color);
		border-radius: 4px;
		color: rgb(255, 255, 255);
		cursor: pointer;
		font-family: sans-serif;
		font-size: 14px;
		line-height: 18px;
		padding: 6px 12px;
		transition: background-color 0.125s, border-color 0.125s, color 0.125s;
	}

	.${CLASS_NAME}:hover {
		background-color: var(--authentic-accent-color-bright);
	}

	.${CLASS_NAME}:focus {
		background-color: var(--authentic-accent-color-bright);
	}

	.${CLASS_NAME}[disabled] {
		background-color: rgb(95, 95, 95);
		cursor: not-allowed;
	}
`));
function FormButton(managers, { ...augmentations }, ...children) {
    let enabled = managers.backend.getSubmittable();
    return ((0, Block_1.Block)("button", {
        class: [`${CLASS_NAME}`],
        disabled: enabled.compute((enabled) => enabled ? undefined : "")
    }, ...children).augment(augmentations));
}
exports.FormButton = FormButton;
;
