"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonTitle = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
const CLASS_NAME = "authentic-button-title";
document.head.appendChild(bonsai_1.html.style({}, `
	.${CLASS_NAME} {
		color: var(--authentic-button-fg-color);
		font-family: sans-serif;
		font-size: 14px;
		font-stretch: normal;
		font-style: normal;
		font-weight: normal;
		height: auto;
		line-height: 20px;
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
        class: [`${CLASS_NAME}`]
    }, ...children));
}
exports.ButtonTitle = ButtonTitle;
;
