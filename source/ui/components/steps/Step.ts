import { Children, html, State, stateify } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";

document.head.appendChild(html.style({}, `\
	.step {

	}

	.step--visible {

	}

	.step--hidden {

	}
`));

export type Step = {
	visible: State<boolean>;
};

export function Step(managers: Managers, attributes: Step, ...children: Children) {
	let visible = stateify(attributes.visible);
	return (
		html.div({
			class: ["step", visible.compute((visible) => visible ? "step--visible" : "step--hidden")]
		},
			...children
		)
	);
};
