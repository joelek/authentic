"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
const bonsai_1 = require("@joelek/bonsai");
const CLASS_NAME = "authentic-block";
document.head.appendChild(bonsai_1.html.style({}, `
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
function Block(type, { ...augmentations }, ...children) {
    return (bonsai_1.html[type]({
        ...augmentations,
        class: [`${CLASS_NAME}`, ...(augmentations.class ?? [])]
    }, ...children));
}
exports.Block = Block;
;
