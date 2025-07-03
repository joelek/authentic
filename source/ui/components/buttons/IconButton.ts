import { Augmentations, html } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";
import { Icon } from "../Icon";

const CLASS_NAME = "authentic-icon-button";

document.head.appendChild(html.style({}, `
	.${CLASS_NAME} {
		background-color: transparent;
		color: rgb(255, 255, 255);
		cursor: pointer;
		padding: 8px;
	}

	.${CLASS_NAME}:hover {
		background-color: rgb(95, 95, 95);
	}

	.${CLASS_NAME}[disabled] {
		background-color: transparent;
		color: rgb(127, 127, 127);
		cursor: not-allowed;
	}
`));

export type IconButton = Augmentations<HTMLElementEventMap, HTMLButtonElement> & {
	graphic: Icon["graphic"];
};

export function IconButton(managers: Managers, { graphic: $graphic, ...augmentations }: IconButton) {
	let graphic = $graphic;
	return (
		Block("button", {
			class: [`${CLASS_NAME}`]
		},
			Icon(managers, {
				graphic: graphic as any,
				size: "24px"
			})
		).augment(augmentations)
	);
};
