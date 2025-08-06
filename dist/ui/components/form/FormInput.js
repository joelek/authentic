"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormInput = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
const CLASS_NAME = "authentic-form-input";
document.head.appendChild(bonsai_1.html.style({}, `
	.${CLASS_NAME} {
		background-color: var(--authentic-input-bg-color);
		border-color: var(--authentic-input-border-color);
		border-radius: 4px;
		border-style: solid;
		border-width: 1px;
		color: var(--authentic-input-fg-color);
		font-family: sans-serif;
		font-size: 14px;
		height: auto;
		line-height: 20px;
		padding: 5px;
		transition: background-color 0.125s, border-color 0.125s, color 0.125s;
	}

	.${CLASS_NAME}:hover {
		background-color: var(--authentic-active-input-bg-color);
		border-color: var(--authentic-active-input-border-color);
	}

	.${CLASS_NAME}:focus {
		background-color: var(--authentic-active-input-bg-color);
		border-color: var(--authentic-active-input-border-color);
	}

	.${CLASS_NAME}[readonly] {
		background-color: var(--authentic-disabled-input-bg-color);
		border-color: var(--authentic-disabled-input-border-color);
		cursor: not-allowed;
	}
`));
function FormInput(managers, { enabled: $enabled, ...augmentations }) {
    let enabled = (0, bonsai_1.stateify)($enabled);
    return ((0, Block_1.Block)("input", {
        class: [`${CLASS_NAME}`],
        readonly: enabled.compute((enabled) => enabled === false ? "" : undefined),
        spellcheck: false
    }).augment(augmentations));
}
exports.FormInput = FormInput;
;
