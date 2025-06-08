import { Augmentations, html } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

document.head.appendChild(html.style({}, `\
	.form-input {
		background-color: rgb(63, 63, 63);
		border-radius: 4px;
		color: rgb(255, 255, 255);
		font-family: sans-serif;
		font-size: 14px;
		line-height: 18px;
		padding: 8px;
		transition: all 0.125s;
	}

	.form-input:focus {
		background-color: rgb(79, 79, 79);
	}

	.form-input[readonly] {
		cursor: not-allowed;
	}
`));

export type FormInput = Augmentations<HTMLElementEventMap, HTMLInputElement> & {

};

export function FormInput(managers: Managers, attributes: FormInput) {
	let enabled = managers.backend.getEditable();
	return (
		Block("input", {
			class: ["form-input"],
			readonly: enabled.compute((enabled) => enabled ? undefined : ""),
			spellcheck: false,
			...attributes
		})
	);
};
