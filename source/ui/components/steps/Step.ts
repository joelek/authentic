import { Children, html, State } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

document.head.appendChild(html.style({}, `\
	.step {
		display: grid;
		gap: 24px;
	}

	.step--visible {

	}

	.step--hidden {
		display: none;
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
			...children
		)
	);
};
