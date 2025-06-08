import { Augmentations, Children, html } from "@joelek/bonsai";

document.head.appendChild(html.style({}, `\
	.block {
		box-sizing: border-box;
			width: 100%;
			height: 100%;
		overflow: hidden;
		position: relative;
	}

	.block {
		border: none;
		margin: 0px;
		outline: none;
		padding: 0px;
	}
`));

export type Block<A extends keyof HTMLElementTagNameMap> = Augmentations<HTMLElementEventMap, HTMLElementTagNameMap[A]>;

export function Block<A extends keyof HTMLElementTagNameMap>(type: A, attributes: Block<A>, ...children: Children) {
	return (
		html[type](attributes, ...children)
			.attribute("class", (classes) => ["block", ...classes])
	);
};
