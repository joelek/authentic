import { Augmentations, Children, html } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

document.head.appendChild(html.style({}, `\
	.form-group {
		display: grid;
		gap: 12px;
	}
`));

export type FormGroup = Augmentations<HTMLElementEventMap, HTMLFormElement> & {

};

export function FormGroup(managers: Managers, attributes: FormGroup, ...children: Children) {
	return (
		Block("form", {
			class: ["form-group"],
			...attributes
		}, ...children)
	);
};
