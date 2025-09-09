"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormButton = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
const CLASS_NAME = "authentic-form-button";
document.head.appendChild(bonsai_1.html.style({}, `
	.${CLASS_NAME} {
		border-radius: 6px;
		border-style: solid;
		border-width: 1px;
		cursor: pointer;
		font-family: sans-serif;
		font-size: 14px;
		height: auto;
		line-height: 20px;
		padding: 5px;
		transition: background-color 0.125s, border-color 0.125s, color 0.125s;
	}

	.${CLASS_NAME}[disabled] {
		cursor: not-allowed;
	}

	.${CLASS_NAME}--primary {
		background-color: var(--authentic-primary-button-bg-color);
		border-color: var(--authentic-primary-button-border-color);
		color: var(--authentic-primary-button-fg-color);
	}

	.${CLASS_NAME}--primary:hover,
	.${CLASS_NAME}--primary:focus {
		background-color: var(--authentic-active-primary-button-bg-color);
		border-color: var(--authentic-active-primary-button-border-color);
		color: var(--authentic-active-primary-button-fg-color);
	}

	.${CLASS_NAME}--primary[disabled] {
		background-color: var(--authentic-disabled-primary-button-bg-color);
		border-color: var(--authentic-disabled-primary-button-border-color);
		color: var(--authentic-disabled-primary-button-fg-color);
	}

	.${CLASS_NAME}--secondary {
		background-color: var(--authentic-secondary-button-bg-color);
		border-color: var(--authentic-secondary-button-border-color);
		color: var(--authentic-secondary-button-fg-color);
	}

	.${CLASS_NAME}--secondary:hover,
	.${CLASS_NAME}--secondary:focus {
		background-color: var(--authentic-active-secondary-button-bg-color);
		border-color: var(--authentic-active-secondary-button-border-color);
		color: var(--authentic-active-secondary-button-fg-color);
	}

	.${CLASS_NAME}--secondary[disabled] {
		background-color: var(--authentic-disabled-secondary-button-bg-color);
		border-color: var(--authentic-disabled-secondary-button-border-color);
		color: var(--authentic-disabled-secondary-button-fg-color);
	}
`));
function FormButton(managers, { enabled: $enabled, primary: $primary, ...augmentations }, ...children) {
    let enabled = (0, bonsai_1.stateify)($enabled);
    let primary = (0, bonsai_1.stateify)($primary);
    return ((0, Block_1.Block)("button", {
        class: [`${CLASS_NAME}`, primary.compute((primary) => primary === true ? `${CLASS_NAME}--primary` : `${CLASS_NAME}--secondary`)],
        disabled: enabled.compute((enabled) => enabled === false ? "" : undefined)
    }, ...children).augment(augmentations));
}
exports.FormButton = FormButton;
;
