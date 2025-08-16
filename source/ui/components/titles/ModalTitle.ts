import {  Children, html } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";

const CLASS_NAME = "authentic-modal-title";

document.head.appendChild(html.style({}, `
	.${CLASS_NAME} {
		font-family: sans-serif;
		font-size: 14px;
		font-stretch: normal;
		font-style: normal;
		font-weight: normal;
		height: auto;
		line-height: 20px;
		overflow: hidden;
		text-align: left;
		text-overflow: ellipsis;
		user-select: none;
		white-space: nowrap;
		word-break: break-word;
	}
`));

export type ModalTitle = {};

export function ModalTitle(managers: Managers, attributes: ModalTitle, ...children: Children) {
	return (
		Block("p", {
			class: [`${CLASS_NAME}`]
		},
			...children
		)
	);
};
