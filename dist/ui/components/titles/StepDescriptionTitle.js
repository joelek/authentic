"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepDescriptionTitle = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
document.head.appendChild(bonsai_1.html.style({}, `\
	.step-description-title {
		color: rgb(191, 191, 191);
		font-family: sans-serif;
		font-size: 14px;
		line-height: 18px;
		overflow: visible;
		text-align: left;
		text-overflow: ellipsis;
		user-select: none;
		white-space: pre-wrap;
		word-break: break-word;
	}
`));
function StepDescriptionTitle(managers, attributes, ...children) {
    return ((0, Block_1.Block)("p", {
        class: ["step-description-title"]
    }, ...children));
}
exports.StepDescriptionTitle = StepDescriptionTitle;
;
