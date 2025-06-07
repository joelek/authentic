import { Augmentations, Children, FunctionalElementEventMap, html } from "@joelek/bonsai";

document.head.appendChild(html.style({}, `\
	.block {
		box-sizing: border-box;
			width: 100%;
			height: 100%;
		overflow: hidden;
		position: relative;
	}
`));

export type BlockEvents<A> = FunctionalElementEventMap<A> & {};

export type Block = {};

export function Block<A extends BlockEvents<A>, B extends Element>(attributes: Augmentations<A, B>, ...children: Children) {
	return (
		html.div(attributes, ...children)
			.attribute("class", (classes) => ["block", ...classes])
	);
};
