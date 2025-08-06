"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormButton = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
const CLASS_NAME = "authentic-form-button";
document.head.appendChild(bonsai_1.html.style({}, `
	.${CLASS_NAME} {
		background-color: var(--authentic-button-bg-color);
		border-color: var(--authentic-button-border-color);
		border-radius: 4px;
		border-style: solid;
		border-width: 1px;
		color: var(--authentic-button-fg-color);
		cursor: pointer;
		font-family: sans-serif;
		font-size: 14px;
		height: auto;
		line-height: 20px;
		padding: 5px;
		transition: background-color 0.125s, border-color 0.125s, color 0.125s;
	}

	.${CLASS_NAME}:hover {
		background-color: var(--authentic-active-button-bg-color);
		border-color: var(--authentic-active-button-border-color);
	}

	.${CLASS_NAME}:focus {
		background-color: var(--authentic-active-button-bg-color);
		border-color: var(--authentic-active-button-border-color);
	}

	.${CLASS_NAME}[disabled] {
		background-color: var(--authentic-disabled-button-bg-color);
		border-color: var(--authentic-disabled-button-border-color);
		cursor: not-allowed;
	}
`));
function FormButton(managers, { enabled: $enabled, ...augmentations }, ...children) {
    let enabled = (0, bonsai_1.stateify)($enabled);
    return ((0, Block_1.Block)("button", {
        class: [`${CLASS_NAME}`],
        disabled: enabled.compute((enabled) => enabled === false ? "" : undefined)
    }, ...children).augment(augmentations));
}
exports.FormButton = FormButton;
;
