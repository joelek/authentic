"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Step = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
document.head.appendChild(bonsai_1.html.style({}, `\
	.step {
		transition: all 0.50s;
	}

	.step--visible {
		height: auto;
		opacity: 1.0;
		transform: translate(0px, 0px);
	}

	.step--hidden {
		height: 0px;
		opacity: 0.0;
		transform: translate(0px, 120px);
	}

	.step__content {
		display: grid;
		gap: 24px;
	}
`));
function Step(managers, attributes, ...children) {
    let type = attributes.type;
    let reason = attributes.reason;
    let visible = type.compute((type) => type != null);
    return ((0, Block_1.Block)("div", {
        class: ["step", visible.compute((visible) => visible ? "step--visible" : "step--hidden")]
    }, (0, Block_1.Block)("div", {
        class: ["step__content"]
    }, ...children)));
}
exports.Step = Step;
;
