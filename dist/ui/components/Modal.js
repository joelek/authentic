"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = void 0;
const bonsai_1 = require("@joelek/bonsai");
const steps_1 = require("./steps");
const WaitingForCommandStep_1 = require("./steps/WaitingForCommandStep");
document.head.appendChild(bonsai_1.html.style({}, `\
	.modal {

	}

	.modal--visible {

	}

	.modal--hidden {
		display: none;
	}
`));
function Modal(managers, attributes) {
    let visible = (0, bonsai_1.stateify)(attributes.visible);
    return (bonsai_1.html.div({
        class: ["modal", visible.compute((visible) => visible ? "modal--visible" : "modal--hidden")]
    }, (0, WaitingForCommandStep_1.WaitingForCommandStep)(managers, {}), (0, steps_1.WaitingForAuthenticateEmailStep)(managers, {}), (0, steps_1.WaitingForAuthenticatePassphraseStep)(managers, {}), (0, steps_1.WaitingForAuthenticateTokenStep)(managers, {}), (0, steps_1.WaitingForAuthenticateUsernameStep)(managers, {}), (0, steps_1.AuthenticatedStep)(managers, {}), (0, steps_1.WaitingForRecoverEmailStep)(managers, {}), (0, steps_1.WaitingForRecoverPassphraseStep)(managers, {}), (0, steps_1.WaitingForRecoverTokenStep)(managers, {}), (0, steps_1.WaitingForRecoverUsernameStep)(managers, {}), (0, steps_1.RecoveredStep)(managers, {}), (0, steps_1.WaitingForRegisterEmailStep)(managers, {}), (0, steps_1.WaitingForRegisterPassphraseStep)(managers, {}), (0, steps_1.WaitingForRegisterTokenStep)(managers, {}), (0, steps_1.WaitingForRegisterUsernameStep)(managers, {}), (0, steps_1.RegisteredStep)(managers, {})));
}
exports.Modal = Modal;
;
