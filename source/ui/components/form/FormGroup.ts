import { Augmentations, Children, html } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

const CLASS_NAME = "authentic-form-group";

document.head.appendChild(html.style({}, `
	.${CLASS_NAME} {
		display: grid;
		gap: 12px;
	}
`));

export type FormGroup = Augmentations<HTMLElementEventMap, HTMLFormElement> & {

};

export function FormGroup(managers: Managers, attributes: FormGroup, ...children: Children) {
	return (
		Block("form", {
			class: [`${CLASS_NAME}`],
			...attributes
		}, ...children)
	);
};
