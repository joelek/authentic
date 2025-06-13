import { Augmentations, Children, html } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

document.head.appendChild(html.style({}, `
	.form-button {
		background-color: rgb(223, 159, 31);
		border-radius: 4px;
		color: rgb(255, 255, 255);
		cursor: pointer;
		font-family: sans-serif;
		font-size: 14px;
		line-height: 18px;
		padding: 8px 16px;
		transition: all 0.125s;
	}

	.form-button:hover {
		background-color: rgb(239, 175, 47);
	}

	.form-button[disabled] {
		background-color: rgb(95, 95, 95);
		cursor: not-allowed;
	}
`));

export type FormButton = Augmentations<HTMLElementEventMap, HTMLButtonElement> & {

};

export function FormButton(managers: Managers, attributes: FormButton, ...children: Children) {
	let enabled = managers.backend.getSubmittable();
	return (
		Block("button", {
			class: ["form-button"],
			disabled: enabled.compute((enabled) => enabled ? undefined : ""),
			...attributes
		}, ...children)
	);
};
