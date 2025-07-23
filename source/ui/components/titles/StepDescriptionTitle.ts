import {  Children, html } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

const CLASS_NAME = "authentic-step-description-title";

document.head.appendChild(html.style({}, `
	.${CLASS_NAME} {
		color: rgb(191, 191, 191);
		font-family: sans-serif;
		font-size: 14px;
		font-stretch: normal;
		font-style: normal;
		font-weight: normal;
		height: auto;
		line-height: 20px;
		overflow: visible;
		text-align: left;
		text-overflow: ellipsis;
		user-select: none;
		white-space: pre-wrap;
		word-break: break-word;
	}
`));

export type StepDescriptionTitle = {};

export function StepDescriptionTitle(managers: Managers, attributes: StepDescriptionTitle, ...children: Children) {
	return (
		Block("p", {
			class: [`${CLASS_NAME}`]
		},
			...children
		)
	);
};
