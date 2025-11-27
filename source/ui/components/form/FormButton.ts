import { Attribute, Children, html, HTMLElementAugmentations, stateify } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

const CLASS_NAME = "authentic-form-button";

document.head.appendChild(html.style({}, `
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
		transition: background-color 0.125s, border-color 0.125s, color 0.125s, opacity 0.125s;
	}

	.${CLASS_NAME}[disabled] {
		cursor: not-allowed;
		opacity: 0.5;
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
`));

export type FormButton = HTMLElementAugmentations<HTMLButtonElement> & {
	enabled?: Attribute<boolean | undefined>;
	primary?: Attribute<boolean | undefined>;
};

export function FormButton(managers: Managers, { enabled: $enabled, primary: $primary, ...augmentations }: FormButton, ...children: Children) {
	let enabled = stateify($enabled);
	let primary = stateify($primary);
	return (
		Block("button", {
			class: [`${CLASS_NAME}`, primary.compute((primary) => primary === true ? `${CLASS_NAME}--primary` : `${CLASS_NAME}--secondary`)],
			disabled: enabled.compute((enabled) => enabled === false ? "" : undefined)
		},
			...children
		).augment(augmentations)
	);
};
