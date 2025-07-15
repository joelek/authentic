import {  Children, html } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

const CLASS_NAME = "authentic-button-title";

document.head.appendChild(html.style({}, `
	.${CLASS_NAME} {
		color: rgb(255, 255, 255);
		font-family: sans-serif;
		font-size: 14px;
		height: auto;
		line-height: 20px;
		overflow: hidden;
		text-align: center;
		text-overflow: ellipsis;
		user-select: none;
		white-space: nowrap;
		word-break: break-word;
	}
`));

export type ButtonTitle = {};

export function ButtonTitle(managers: Managers, attributes: ButtonTitle, ...children: Children) {
	return (
		Block("p", {
			class: [`${CLASS_NAME}`]
		},
			...children
		)
	);
};
