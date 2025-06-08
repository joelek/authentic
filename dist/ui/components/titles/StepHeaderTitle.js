"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepHeaderTitle = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
document.head.appendChild(bonsai_1.html.style({}, `\
	.step-header-title {
		color: rgb(255, 255, 255);
		font-family: sans-serif;
		font-size: 18px;
		line-height: 24px;
		overflow: visible;
		text-align: center;
		text-overflow: ellipsis;
		user-select: none;
		white-space: pre-wrap;
		word-break: break-word;
	}
`));
function StepHeaderTitle(managers, attributes, ...children) {
    return ((0, Block_1.Block)("p", {
        class: ["step-header-title"]
    }, ...children));
}
exports.StepHeaderTitle = StepHeaderTitle;
;
