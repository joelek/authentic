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
		line-height: 18px;
		padding: 8px;
		transition: all 0.125s;
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

export function FormInput(managers: Managers, attributes: FormInput) {
	let enabled = managers.backend.getEditable();
	return (
		Block("input", {
			class: [`${CLASS_NAME}`],
			readonly: enabled.compute((enabled) => enabled ? undefined : ""),
			spellcheck: false,
			...attributes
		})
	);
};
