"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepTitle = void 0;
const bonsai_1 = require("@joelek/bonsai");
document.head.appendChild(bonsai_1.html.style({}, `\
	.step-title {

	}
`));
function StepTitle(managers, attributes, ...children) {
    return (bonsai_1.html.p({
        class: ["step-title"]
    }, ...children));
}
exports.StepTitle = StepTitle;
;
