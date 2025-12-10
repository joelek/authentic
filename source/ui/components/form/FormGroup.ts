import { Children, html, HTMLElementAugmentations } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

const CLASS_NAME = "authentic-form-group";

document.head.appendChild(html.style({}, `
	.${CLASS_NAME} {
		display: grid;
		gap: 12px;
	}
`));

export type FormGroup = HTMLElementAugmentations<HTMLDivElement> & {

};

export function FormGroup(managers: Managers, { ...augmentations }: FormGroup, ...children: Children) {
	return (
		Block("div", {
			class: [`${CLASS_NAME}`]
		},
			...children
		).augment(augmentations)
	);
};
