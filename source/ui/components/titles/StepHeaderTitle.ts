import {  Children, html } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

document.head.appendChild(html.style({}, `
	.step-header-title {
		color: rgb(255, 255, 255);
		font-family: sans-serif;
		font-size: 18px;
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
			class: ["step-header-title"]
		},
			...children
		)
	);
};
