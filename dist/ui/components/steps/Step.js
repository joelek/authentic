"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Step = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
document.head.appendChild(bonsai_1.html.style({}, `\
	.step {
		display: grid;
		gap: 24px;
	}

	.step--visible {

	}

	.step--hidden {
		display: none;
	}
`));
function Step(managers, attributes, ...children) {
    let type = attributes.type;
    let reason = attributes.reason;
    let visible = type.compute((type) => type != null);
    return ((0, Block_1.Block)("div", {
        class: ["step", visible.compute((visible) => visible ? "step--visible" : "step--hidden")]
    }, ...children));
}
exports.Step = Step;
;
