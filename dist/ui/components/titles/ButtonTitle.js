"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonTitle = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
document.head.appendChild(bonsai_1.html.style({}, `
	.button-title {
		color: rgb(255, 255, 255);
		font-family: sans-serif;
		font-size: 14px;
		line-height: 18px;
		overflow: hidden;
		text-align: center;
		text-overflow: ellipsis;
		user-select: none;
		white-space: nowrap;
		word-break: break-word;
	}
`));
function ButtonTitle(managers, attributes, ...children) {
    return ((0, Block_1.Block)("p", {
        class: ["button-title"]
    }, ...children));
}
exports.ButtonTitle = ButtonTitle;
;
