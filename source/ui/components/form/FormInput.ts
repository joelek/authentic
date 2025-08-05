import { Augmentations, html } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

const CLASS_NAME = "authentic-form-input";

document.head.appendChild(html.style({}, `
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

	.${CLASS_NAME}:focus {
		background-color: rgb(79, 79, 79);
	}

	.${CLASS_NAME}[readonly] {
		cursor: not-allowed;
	}
`));

export type FormInput = Augmentations<HTMLElementEventMap, HTMLInputElement> & {

};

export function FormInput(managers: Managers, { ...augmentations }: FormInput) {
	let enabled = managers.backend.getEditable();
	return (
		Block("input", {
			class: [`${CLASS_NAME}`],
			readonly: enabled.compute((enabled) => enabled ? undefined : ""),
			spellcheck: false
		}).augment(augmentations)
	);
};
