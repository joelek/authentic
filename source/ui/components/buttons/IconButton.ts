import { Augmentations, html } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";
import { Icon } from "../Icon";

document.head.appendChild(html.style({}, `
	.authentic-icon-button {
		background-color: transparent;
		color: rgb(255, 255, 255);
		cursor: pointer;
		padding: 8px;
	}

	.authentic-icon-button:hover {
		background-color: rgb(95, 95, 95);
	}

	.authentic-icon-button[disabled] {
		background-color: transparent;
		color: rgb(127, 127, 127);
		cursor: not-allowed;
	}
`));

export type IconButton = Augmentations<HTMLElementEventMap, HTMLButtonElement> & {
	icon: Icon["graphic"];
};

export function IconButton(managers: Managers, attributes: IconButton) {
	let icon = attributes.icon;
	return (
		Block("button", {
			class: ["authentic-icon-button"],
			...attributes
		},
			Icon({
				graphic: icon as any,
				size: "24px"
			})
		)
	);
};
