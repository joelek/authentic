import {  Children, html } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

document.head.appendChild(html.style({}, `
	.button-title {
		color: rgb(255, 255, 255);
		font-family: sans-serif;
		font-size: 14px;
		height: auto;
		line-height: 18px;
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
			class: ["button-title"]
		},
			...children
		)
	);
};
