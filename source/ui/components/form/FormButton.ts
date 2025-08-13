import { Attribute, Children, html, HTMLElementAugmentations, stateify } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

const CLASS_NAME = "authentic-form-button";

document.head.appendChild(html.style({}, `
	.${CLASS_NAME} {
		background-color: var(--authentic-button-bg-color);
		border-color: var(--authentic-button-border-color);
		border-radius: 3px;
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

export type FormButton = HTMLElementAugmentations<HTMLButtonElement> & {
	enabled?: Attribute<boolean | undefined>;
};

export function FormButton(managers: Managers, { enabled: $enabled, ...augmentations }: FormButton, ...children: Children) {
	let enabled = stateify($enabled);
	return (
		Block("button", {
			class: [`${CLASS_NAME}`],
			disabled: enabled.compute((enabled) => enabled === false ? "" : undefined)
		},
			...children
		).augment(augmentations)
	);
};
