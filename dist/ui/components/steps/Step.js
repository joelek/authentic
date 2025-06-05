"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Step = void 0;
const bonsai_1 = require("@joelek/bonsai");
document.head.appendChild(bonsai_1.html.style({}, `\
	.step {

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
    return (bonsai_1.html.div({
        class: ["step", visible.compute((visible) => visible ? "step--visible" : "step--hidden")]
    }, ...children, bonsai_1.html.p({}, managers.translation.getStateTranslation(type)), bonsai_1.html.p({}, managers.translation.getStateTranslation(reason))));
}
exports.Step = Step;
;
