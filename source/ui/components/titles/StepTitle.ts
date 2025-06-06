import { Children, html } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";

document.head.appendChild(html.style({}, `\
	.step-title {

	}
`));

export type StepTitle = {};

export function StepTitle(managers: Managers, attributes: StepTitle, ...children: Children) {
	return (
		html.p({
			class: ["step-title"]
		},
			...children
		)
	);
};
