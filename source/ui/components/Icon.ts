import { Attribute, HTMLElementAugmentations, html, stateify, svg } from "@joelek/bonsai";
import { Managers } from "../managers/Managers";

type Data = [string, [string, string][], Data[]];

function createDataRecord<A extends { [key: string]: Data; }>(data: A): Record<keyof A, Data> {
	return data;
};

const ICON_DATA = createDataRecord({
	["cross"]: ["g",[],[["g",[],[["path",[["d","M13.414,12l7.071-7.071c0.391-0.39,0.391-1.023,0-1.414s-1.024-0.391-1.414,0L12,10.586L4.929,3.515c-0.39-0.391-1.023-0.391-1.414,0s-0.391,1.024,0,1.414L10.586,12l-7.071,7.071c-0.391,0.39-0.391,1.023,0,1.414s1.024,0.391,1.414,0L12,13.414l7.071,7.071c0.39,0.391,1.023,0.391,1.414,0s0.391-1.024,0-1.414L13.414,12z"]],[]]]]]],
	["chevron-down"]: ["g",[],[["g",[],[["path",[["d","M21.707,6.293c-0.391-0.391-1.023-0.391-1.414,0L12,14.586L3.707,6.293c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l9,9C11.48,16.895,11.734,17,12,17s0.52-0.105,0.707-0.293l9-9C22.098,7.316,22.098,6.684,21.707,6.293z"]],[]]]]]],
	["none"]: ["g",[],[["g",[],[]]]]
});

type Graphic = keyof typeof ICON_DATA;

function render(data: Data) {
	let element = svg[data[0] as keyof typeof svg]();
	for (let [key, value] of data[1]) {
		// @ts-ignore
		element.attribute(key, value);
	}
	element.nodes(...data[2].map(render));
	return element;
};

const CLASS_NAME = "authentic-icon";

document.head.appendChild(html.style({}, `
	.${CLASS_NAME} {

	}

	.${CLASS_NAME}__graphic {
		fill: currentColor;
	}
`));

export type Icon = HTMLElementAugmentations<HTMLDivElement> & {
	graphic: Attribute<Graphic>;
	size: Attribute<string>;
};

export function Icon(managers: Managers, { graphic: $graphic, size: $size, ...augmentations }: Icon) {
	let graphic = stateify($graphic);
	let size = $size;
	return (
		html.div({
			...augmentations,
			class: ["authentic-block", `${CLASS_NAME}`, ...(augmentations.class ?? [])]
		},
			svg.svg({
				class: ["authentic-block", `${CLASS_NAME}__graphic`],
				width: size,
				height: size,
				viewBox: "0 0 24 24",
				style: {
					width: size,
					height: size
				}
			},
				graphic.compute((graphic) => render(ICON_DATA[graphic]))
			)
		)
	);
};
