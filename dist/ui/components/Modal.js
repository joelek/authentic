"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("./Block");
const steps_1 = require("./steps");
const WaitingForCommandStep_1 = require("./steps/WaitingForCommandStep");
document.head.appendChild(bonsai_1.html.style({}, `\
	.modal {
		position: absolute;
			top: 0%;
			left: 0%;
	}

	.modal--visible {

	}

	.modal--hidden {
		display: none;
	}

	.modal__background {
		background-color: rgb(31, 31, 31);
		padding: 24px;
	}

	.modal__positioner {
		align-content: center;
		display: grid;
		grid-template-columns: minmax(240px, 400px);
		justify-content: center;
	}

	.modal__window {
		background-color: rgb(47, 47, 47);
		border-radius: 2px;
	}

	.modal__scroll {
		overflow-x: auto;
		overflow-y: auto;
	}

	.modal__scroll::-webkit-scrollbar {
		background-color: transparent;
		height: 12px;
		width: 12px;
	}

	.modal__scroll::-webkit-scrollbar-corner {
		background-color: transparent;
	}

	.modal__scroll::-webkit-scrollbar-thumb {
		background-color: rgb(63, 63, 63);
		border-radius: 12px;
	}

	.modal__content {
		height: auto;
		padding: 24px;
	}
`));
function Modal(managers, attributes) {
    let visible = (0, bonsai_1.stateify)(attributes.visible);
    return ((0, Block_1.Block)({
        class: ["modal", visible.compute((visible) => visible ? "modal--visible" : "modal--hidden")]
    }, (0, Block_1.Block)({
        class: ["modal__background"]
    }, (0, Block_1.Block)({
        class: ["modal__positioner"]
    }, (0, Block_1.Block)({
        class: ["modal__window"]
    }, (0, Block_1.Block)({
        class: ["modal__scroll"]
    }, (0, Block_1.Block)({
        class: ["modal__content"]
    }, (0, WaitingForCommandStep_1.WaitingForCommandStep)(managers, {}), (0, steps_1.WaitingForAuthenticateEmailStep)(managers, {}), (0, steps_1.WaitingForAuthenticatePassphraseStep)(managers, {}), (0, steps_1.WaitingForAuthenticateTokenStep)(managers, {}), (0, steps_1.WaitingForAuthenticateUsernameStep)(managers, {}), (0, steps_1.AuthenticatedStep)(managers, {}), (0, steps_1.WaitingForRecoverEmailStep)(managers, {}), (0, steps_1.WaitingForRecoverPassphraseStep)(managers, {}), (0, steps_1.WaitingForRecoverTokenStep)(managers, {}), (0, steps_1.WaitingForRecoverUsernameStep)(managers, {}), (0, steps_1.RecoveredStep)(managers, {}), (0, steps_1.WaitingForRegisterEmailStep)(managers, {}), (0, steps_1.WaitingForRegisterPassphraseStep)(managers, {}), (0, steps_1.WaitingForRegisterTokenStep)(managers, {}), (0, steps_1.WaitingForRegisterUsernameStep)(managers, {}), (0, steps_1.RegisteredStep)(managers, {}))))))));
}
exports.Modal = Modal;
;
