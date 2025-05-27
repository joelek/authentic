import { html, State, stateify } from "@joelek/bonsai";
import { Managers } from "../managers/Managers";
import { WaitingForCommandStep } from "./steps/WaitingForCommandStep";

document.head.appendChild(html.style({}, `\
	.modal {

	}

	.modal--visible {

	}

	.modal--hidden {

	}
`));

export type Modal = {
	visible: State<boolean>;
};

export function Modal(managers: Managers, attributes: Modal) {
	let visible = stateify(attributes.visible);
	return (
		html.div({
			class: ["modal", visible.compute((visible) => visible ? "modal--visible" : "modal--hidden")]
		},
			WaitingForCommandStep(managers, {})
		)
	);
};
