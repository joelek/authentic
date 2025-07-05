"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icon = void 0;
const bonsai_1 = require("@joelek/bonsai");
function createDataRecord(data) {
    return data;
}
;
const ICON_DATA = createDataRecord({
    ["cross"]: ["g", [], [["g", [], [["path", [["d", "M13.414,12l7.071-7.071c0.391-0.39,0.391-1.023,0-1.414s-1.024-0.391-1.414,0L12,10.586L4.929,3.515c-0.39-0.391-1.023-0.391-1.414,0s-0.391,1.024,0,1.414L10.586,12l-7.071,7.071c-0.391,0.39-0.391,1.023,0,1.414s1.024,0.391,1.414,0L12,13.414l7.071,7.071c0.39,0.391,1.023,0.391,1.414,0s0.391-1.024,0-1.414L13.414,12z"]], []]]]]],
    ["none"]: ["g", [], [["g", [], []]]]
});
function render(data) {
    let element = bonsai_1.svg[data[0]]();
    for (let [key, value] of data[1]) {
        // @ts-ignore
        element.attribute(key, value);
    }
    element.nodes(...data[2].map(render));
    return element;
}
;
const CLASS_NAME = "authentic-icon";
document.head.appendChild(bonsai_1.html.style({}, `
	.${CLASS_NAME} {

	}

	.${CLASS_NAME}__graphic {
		fill: currentColor;
	}
`));
function Icon(managers, { graphic: $graphic, size: $size, ...augmentations }) {
    let graphic = (0, bonsai_1.stateify)($graphic);
    let size = $size;
    return (bonsai_1.html.div({
        ...augmentations,
        class: ["authentic-block", `${CLASS_NAME}`]
    }, bonsai_1.svg.svg({
        class: ["authentic-block", `${CLASS_NAME}__graphic`],
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        style: {
            width: size,
            height: size
        }
    }, graphic.compute((graphic) => render(ICON_DATA[graphic])))));
}
exports.Icon = Icon;
;
