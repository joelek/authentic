import { Children, html, State } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

const CLASS_NAME = "authentic-step";

document.head.appendChild(html.style({}, `
	.${CLASS_NAME} {
		transition: transform 0.50s;
	}

	.${CLASS_NAME}--visible {
		height: initial;
		transform: translate(0px, 0px);
	}

	.${CLASS_NAME}--hidden {
		height: 0px;
		transform: translate(0px, 120px);
		visibility: hidden;
	}

	.${CLASS_NAME}__content {
		display: grid;
		gap: 24px;
	}
`));

export type Step<A extends api.State> = {
	type: State<A["type"] | undefined>;
	reason: State<A["reason"] | undefined>;
	ontransition?: (state: "start" | "end") => void;
};

export function Step<A extends api.State>(managers: Managers, attributes: Step<A>, ...children: Children) {
	let type = attributes.type;
	let reason = attributes.reason;
	let ontransition = attributes.ontransition;
	let visible = type.compute((type) => type != null);
	return (
		Block("div", {
			class: [`${CLASS_NAME}`, visible.compute((visible) => visible ? `${CLASS_NAME}--visible` : `${CLASS_NAME}--hidden`)],
			ontransitionstart: (event, element) => {
				if (event.target === element) {
					ontransition?.("start");
				}
			},
			ontransitionend: (event, element) => {
				if (event.target === element) {
					ontransition?.("end");
				}
			}
		},
			Block("div", {
				class: [`${CLASS_NAME}__content`]
			},
				...children
			)
		)
	);
};
