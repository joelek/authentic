"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Step = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
const CLASS_NAME = "authentic-step";
document.head.appendChild(bonsai_1.html.style({}, `
	.${CLASS_NAME} {
		transition: transform 0.50s;
	}

	.${CLASS_NAME}--visible {
		height: initial;
		transform: translate(0px, 0px);
	}

	.${CLASS_NAME}--hidden {
		height: 0px;
		transform: translate(0px, 120px);
		visibility: hidden;
	}

	.${CLASS_NAME}__content {
		display: grid;
		gap: 24px;
	}
`));
function Step(managers, attributes, ...children) {
    let type = attributes.type;
    let reason = attributes.reason;
    let ontransition = attributes.ontransition;
    let visible = type.compute((type) => type != null);
    return ((0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}`, visible.compute((visible) => visible ? `${CLASS_NAME}--visible` : `${CLASS_NAME}--hidden`)],
        ontransitionstart: (event, element) => {
            if (event.target === element) {
                ontransition?.("start");
            }
        },
        ontransitionend: (event, element) => {
            if (event.target === element) {
                ontransition?.("end");
            }
        }
    }, (0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}__content`]
    }, ...children)));
}
exports.Step = Step;
;
