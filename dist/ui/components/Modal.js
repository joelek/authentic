"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("./Block");
const IconButton_1 = require("./buttons/IconButton");
const AuthenticatedStep_1 = require("./steps/AuthenticatedStep");
const WaitingForAuthenticateEmailStep_1 = require("./steps/WaitingForAuthenticateEmailStep");
const WaitingForAuthenticatePassphraseStep_1 = require("./steps/WaitingForAuthenticatePassphraseStep");
const WaitingForAuthenticateTokenStep_1 = require("./steps/WaitingForAuthenticateTokenStep");
const WaitingForAuthenticateUsernameStep_1 = require("./steps/WaitingForAuthenticateUsernameStep");
const WaitingForCommandStep_1 = require("./steps/WaitingForCommandStep");
const WaitingForRecoverEmailStep_1 = require("./steps/WaitingForRecoverEmailStep");
const WaitingForRecoverPassphraseStep_1 = require("./steps/WaitingForRecoverPassphraseStep");
const WaitingForRecoverTokenStep_1 = require("./steps/WaitingForRecoverTokenStep");
const WaitingForRecoverUsernameStep_1 = require("./steps/WaitingForRecoverUsernameStep");
const WaitingForRegisterEmailStep_1 = require("./steps/WaitingForRegisterEmailStep");
const WaitingForRegisterPassphraseStep_1 = require("./steps/WaitingForRegisterPassphraseStep");
const WaitingForRegisterTokenStep_1 = require("./steps/WaitingForRegisterTokenStep");
const WaitingForRegisterUsernameStep_1 = require("./steps/WaitingForRegisterUsernameStep");
const CLASS_NAME = "authentic-modal";
document.head.appendChild(bonsai_1.html.style({}, `
	.${CLASS_NAME} {
		position: absolute;
			top: 0%;
			left: 0%;
	}

	.${CLASS_NAME}--visible {

	}

	.${CLASS_NAME}--hidden {
		display: none;
	}

	.${CLASS_NAME}__background {
		background-color: rgb(31, 31, 31);
		padding: 24px;
	}

	.${CLASS_NAME}__positioner {
		align-content: center;
		display: grid;
		grid-template-columns: minmax(240px, 400px);
		justify-content: center;
	}

	.${CLASS_NAME}__window {
		background-color: rgb(47, 47, 47);
		border-radius: 4px;
		display: grid;
		grid-template-rows: auto minmax(0%, 100%) auto;
	}

	.${CLASS_NAME}__head {
		align-items: center;
		background-color: rgb(63, 63, 63);
		display: grid;
		grid-template-columns: auto;
		justify-content: end;
	}

	.${CLASS_NAME}__body {

	}

	.${CLASS_NAME}__foot {

	}

	.${CLASS_NAME}__scroll {
		overflow-x: auto;
		overflow-y: auto;
	}

	.${CLASS_NAME}__scroll::-webkit-scrollbar {
		background-color: transparent;
		height: 12px;
		width: 12px;
	}

	.${CLASS_NAME}__scroll::-webkit-scrollbar-corner {
		background-color: transparent;
	}

	.${CLASS_NAME}__scroll::-webkit-scrollbar-thumb {
		background-color: rgb(63, 63, 63);
		border-radius: 12px;
	}

	.${CLASS_NAME}__content {
		height: auto;
		padding: 24px;
	}
`));
function Modal(managers, attributes) {
    let visible = managers.state.visible;
    return ((0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}`, visible.compute((visible) => visible ? `${CLASS_NAME}--visible` : `${CLASS_NAME}--hidden`)]
    }, (0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}__background`]
    }, (0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}__positioner`]
    }, (0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}__window`]
    }, (0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}__head`]
    }, (0, IconButton_1.IconButton)(managers, {
        graphic: "cross",
        onclick: () => {
            visible.update(!visible.value());
        }
    })), (0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}__body`]
    }, (0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}__scroll`]
    }, (0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}__content`]
    }, (0, AuthenticatedStep_1.AuthenticatedStep)(managers, {}), (0, WaitingForCommandStep_1.WaitingForCommandStep)(managers, {}), (0, WaitingForAuthenticateEmailStep_1.WaitingForAuthenticateEmailStep)(managers, {}), (0, WaitingForAuthenticatePassphraseStep_1.WaitingForAuthenticatePassphraseStep)(managers, {}), (0, WaitingForAuthenticateTokenStep_1.WaitingForAuthenticateTokenStep)(managers, {}), (0, WaitingForAuthenticateUsernameStep_1.WaitingForAuthenticateUsernameStep)(managers, {}), (0, WaitingForRecoverEmailStep_1.WaitingForRecoverEmailStep)(managers, {}), (0, WaitingForRecoverPassphraseStep_1.WaitingForRecoverPassphraseStep)(managers, {}), (0, WaitingForRecoverTokenStep_1.WaitingForRecoverTokenStep)(managers, {}), (0, WaitingForRecoverUsernameStep_1.WaitingForRecoverUsernameStep)(managers, {}), (0, WaitingForRegisterEmailStep_1.WaitingForRegisterEmailStep)(managers, {}), (0, WaitingForRegisterPassphraseStep_1.WaitingForRegisterPassphraseStep)(managers, {}), (0, WaitingForRegisterTokenStep_1.WaitingForRegisterTokenStep)(managers, {}), (0, WaitingForRegisterUsernameStep_1.WaitingForRegisterUsernameStep)(managers, {})))), (0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}__foot`]
    }))))));
}
exports.Modal = Modal;
;
