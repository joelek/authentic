"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
const bonsai_1 = require("@joelek/bonsai");
document.head.appendChild(bonsai_1.html.style({}, `
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
function Block(type, attributes, ...children) {
    return (bonsai_1.html[type](attributes, ...children)
        .attribute("class", (classes) => ["block", ...classes]));
}
exports.Block = Block;
;
