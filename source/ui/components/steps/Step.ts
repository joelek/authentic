import { Children, html, State } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";

document.head.appendChild(html.style({}, `\
	.step {

	}

	.step--visible {

	}

	.step--hidden {

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
		html.div({
			class: ["step", visible.compute((visible) => visible ? "step--visible" : "step--hidden")]
		},
			...children,
			html.p({}, managers.translation.getStateTranslation(type)),
			html.p({}, managers.translation.getStateTranslation(reason))
		)
	);
};
