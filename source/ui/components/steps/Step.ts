import { Children, html, State } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

document.head.appendChild(html.style({}, `
	.step {
		transition: all 0.50s;
	}

	.step--visible {
		height: auto;
		opacity: 1.0;
		transform: translate(0px, 0px);
	}

	.step--hidden {
		height: 0px;
		opacity: 0.0;
		transform: translate(0px, 120px);
	}

	.step__content {
		display: grid;
		gap: 24px;
	}
`));

export type Step<A extends api.State> = {
	type: State<A["type"] | undefined>;
	reason: State<A["reason"] | undefined>;
};

export function Step<A extends api.State>(managers: Managers, attributes: Step<A>, ...children: Children) {
	let type = attributes.type;
	let reason = attributes.reason;
	let visible = type.compute((type) => type != null);
	return (
		Block("div", {
			class: ["step", visible.compute((visible) => visible ? "step--visible" : "step--hidden")]
		},
			Block("div", {
				class: ["step__content"]
			},
				...children
			)
		)
	);
};
