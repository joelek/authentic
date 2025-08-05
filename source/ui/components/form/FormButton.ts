import { Attribute, Children, html, HTMLElementAugmentations, stateify } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

const CLASS_NAME = "authentic-form-button";

document.head.appendChild(html.style({}, `
	.${CLASS_NAME} {
		background-color: var(--authentic-accent-color);
		border-radius: 4px;
		color: rgb(255, 255, 255);
		cursor: pointer;
		font-family: sans-serif;
		font-size: 14px;
		line-height: 18px;
		padding: 6px;
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
