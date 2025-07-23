import {  Children, html } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

const CLASS_NAME = "authentic-step-header-title";

document.head.appendChild(html.style({}, `
	.${CLASS_NAME} {
		color: rgb(255, 255, 255);
		font-family: sans-serif;
		font-size: 18px;
		font-stretch: normal;
		font-style: normal;
		font-weight: normal;
		height: auto;
		line-height: 24px;
		overflow: visible;
		text-align: center;
		text-overflow: ellipsis;
		user-select: none;
		white-space: pre-wrap;
		word-break: break-word;
	}
`));

export type StepHeaderTitle = {};

export function StepHeaderTitle(managers: Managers, attributes: StepHeaderTitle, ...children: Children) {
	return (
		Block("p", {
			class: [`${CLASS_NAME}`]
		},
			...children
		)
	);
};
