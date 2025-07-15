import { Children, html, HTMLElementAugmentations } from "@joelek/bonsai";

const CLASS_NAME = "authentic-block";

document.head.appendChild(html.style({}, `
	.${CLASS_NAME} {
		box-sizing: border-box;
			width: 100%;
			height: 100%;
		display: block;
		overflow: hidden;
		position: relative;
	}

	.${CLASS_NAME} {
		border: none;
		margin: 0px;
		outline: none;
		padding: 0px;
	}
`));

export type Block<A extends keyof HTMLElementTagNameMap> = HTMLElementAugmentations<HTMLElementTagNameMap[A]>;

export function Block<A extends keyof HTMLElementTagNameMap>(type: A, { ...augmentations }: Block<A>, ...children: Children) {
	return (
		html[type]({
			...augmentations,
			class: [`${CLASS_NAME}`, ...(augmentations.class ?? [])]
		},
			...children
		)
	);
};
