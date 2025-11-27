import { Attribute, html, HTMLElementAugmentations, stateify } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

const CLASS_NAME = "authentic-form-input";

document.head.appendChild(html.style({}, `
	.${CLASS_NAME} {
		border-radius: 3px;
		border-style: solid;
		border-width: 1px;
		font-family: sans-serif;
		font-size: 14px;
		height: auto;
		line-height: 20px;
		padding: 5px;
		transition: background-color 0.125s, border-color 0.125s, color 0.125s, opacity 0.125s;
	}

	.${CLASS_NAME} {
		background-color: var(--authentic-input-bg-color);
		border-color: var(--authentic-input-border-color);
		color: var(--authentic-input-fg-color);
	}

	.${CLASS_NAME}:hover,
	.${CLASS_NAME}:focus {
		background-color: var(--authentic-active-input-bg-color);
		border-color: var(--authentic-active-input-border-color);
		color: var(--authentic-active-input-fg-color);
	}

	.${CLASS_NAME}[readonly] {
		cursor: not-allowed;
		opacity: 0.5;
	}
`));

export type FormInput = HTMLElementAugmentations<HTMLInputElement> & {
	enabled?: Attribute<boolean | undefined>;
};

export function FormInput(managers: Managers, { enabled: $enabled, ...augmentations }: FormInput) {
	let enabled = stateify($enabled);
	return (
		Block("input", {
			class: [`${CLASS_NAME}`],
			readonly: enabled.compute((enabled) => enabled === false ? "" : undefined),
			spellcheck: false
		}).augment(augmentations)
	);
};
