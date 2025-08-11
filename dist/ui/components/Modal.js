"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("./Block");
const IconButton_1 = require("./buttons/IconButton");
const AuthenticatedStep_1 = require("./steps/AuthenticatedStep");
const WaitingForAuthenticateEmailStep_1 = require("./steps/WaitingForAuthenticateEmailStep");
const WaitingForAuthenticatePassphraseStep_1 = require("./steps/WaitingForAuthenticatePassphraseStep");
const WaitingForAuthenticateCodeStep_1 = require("./steps/WaitingForAuthenticateCodeStep");
const WaitingForAuthenticateUsernameStep_1 = require("./steps/WaitingForAuthenticateUsernameStep");
const WaitingForCommandStep_1 = require("./steps/WaitingForCommandStep");
const WaitingForRecoverEmailStep_1 = require("./steps/WaitingForRecoverEmailStep");
const WaitingForRecoverPassphraseStep_1 = require("./steps/WaitingForRecoverPassphraseStep");
const WaitingForRecoverCodeStep_1 = require("./steps/WaitingForRecoverCodeStep");
const WaitingForRecoverUsernameStep_1 = require("./steps/WaitingForRecoverUsernameStep");
const WaitingForRegisterEmailStep_1 = require("./steps/WaitingForRegisterEmailStep");
const WaitingForRegisterPassphraseStep_1 = require("./steps/WaitingForRegisterPassphraseStep");
const WaitingForRegisterCodeStep_1 = require("./steps/WaitingForRegisterCodeStep");
const WaitingForRegisterUsernameStep_1 = require("./steps/WaitingForRegisterUsernameStep");
const FormSelect_1 = require("./form/FormSelect");
const ModalTitle_1 = require("./titles/ModalTitle");
const RestartButton_1 = require("./buttons/RestartButton");
const CLASS_NAME = "authentic-modal";
document.head.appendChild(bonsai_1.html.style({}, `
	.${CLASS_NAME} {
		position: fixed;
			top: 0%;
			left: 0%;
	}

	.${CLASS_NAME}--visible {

	}

	.${CLASS_NAME}--hidden {
		visibility: hidden;
	}

	.${CLASS_NAME}__background {
		backdrop-filter: blur(6px);
		background-color: rgba(0, 0, 0, 0.25);
	}

	.${CLASS_NAME}__positioner {
		align-content: center;
		display: grid;
		grid-template-columns: minmax(240px, 480px);
		justify-content: center;
		padding: 24px;
	}

	.${CLASS_NAME}__window {
		border-radius: 3px;
		box-shadow: 0px 0px 12px rgb(0, 0, 0, 0.25);
		display: grid;
		grid-template-rows: auto minmax(0%, 100%) auto;
		transform: translate(0px, 120px);
		transition: none;
	}

	.${CLASS_NAME}--visible .${CLASS_NAME}__window {
		transform: translate(0px, 0px);
		transition: transform 0.50s;
	}

	.${CLASS_NAME}__head {
		align-items: center;
		background-color: var(--authentic-accent-color);
		display: grid;
		grid-template-columns: minmax(0%, 100%) auto;
		padding: 3px;
	}

	.${CLASS_NAME}__title {
		padding: 6px;
	}

	.${CLASS_NAME}__body {
		background-color: var(--authentic-window-bg-color);
	}

	.${CLASS_NAME}__foot {
		background-color: var(--authentic-window-bg-color);
		display: grid;
		grid-auto-flow: column;
		gap: 12px;
		justify-content: end;
		padding: 12px;
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
		background-color: var(--authentic-scrollbar-color);
		background-clip: padding-box;
		border: 1px solid transparent;
		border-radius: 12px;
	}

	.${CLASS_NAME}__scroll:hover::-webkit-scrollbar-thumb {
		background-color: var(--authentic-active-scrollbar-color);
	}

	.${CLASS_NAME}__scroll:focus::-webkit-scrollbar-thumb {
		background-color: var(--authentic-active-scrollbar-color);
	}

	.${CLASS_NAME}__content {
		height: auto;
		padding: 24px;
	}
`));
function Modal(managers, attributes) {
    let visible = managers.state.visible;
    let modal_transition = managers.state.modal_transition;
    return ((0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}`, visible.compute((visible) => visible ? `${CLASS_NAME}--visible` : `${CLASS_NAME}--hidden`)]
    }, (0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}__background`]
    }, (0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}__positioner`]
    }, (0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}__window`],
        ontransitionstart: (event, element) => {
            if (event.target === element) {
                modal_transition.update(true);
            }
        },
        ontransitionend: (event, element) => {
            if (event.target === element) {
                modal_transition.update(false);
            }
        }
    }, (0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}__head`]
    }, (0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}__title`]
    }, (0, ModalTitle_1.ModalTitle)(managers, {}, managers.translation.getTranslation("MANAGE_ACCOUNT"))), (0, IconButton_1.IconButton)(managers, {
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
    }, (0, AuthenticatedStep_1.AuthenticatedStep)(managers, {}), (0, WaitingForCommandStep_1.WaitingForCommandStep)(managers, {}), (0, WaitingForAuthenticateEmailStep_1.WaitingForAuthenticateEmailStep)(managers, {}), (0, WaitingForAuthenticatePassphraseStep_1.WaitingForAuthenticatePassphraseStep)(managers, {}), (0, WaitingForAuthenticateCodeStep_1.WaitingForAuthenticateCodeStep)(managers, {}), (0, WaitingForAuthenticateUsernameStep_1.WaitingForAuthenticateUsernameStep)(managers, {}), (0, WaitingForRecoverEmailStep_1.WaitingForRecoverEmailStep)(managers, {}), (0, WaitingForRecoverPassphraseStep_1.WaitingForRecoverPassphraseStep)(managers, {}), (0, WaitingForRecoverCodeStep_1.WaitingForRecoverCodeStep)(managers, {}), (0, WaitingForRecoverUsernameStep_1.WaitingForRecoverUsernameStep)(managers, {}), (0, WaitingForRegisterEmailStep_1.WaitingForRegisterEmailStep)(managers, {}), (0, WaitingForRegisterPassphraseStep_1.WaitingForRegisterPassphraseStep)(managers, {}), (0, WaitingForRegisterCodeStep_1.WaitingForRegisterCodeStep)(managers, {}), (0, WaitingForRegisterUsernameStep_1.WaitingForRegisterUsernameStep)(managers, {})))), (0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}__foot`]
    }, (0, RestartButton_1.RestartButton)(managers, {}), (0, FormSelect_1.FormSelect)(managers, {
        groups: [
            {
                title: managers.translation.getTranslation("LANGUAGES"),
                options: [
                    {
                        title: managers.translation.getTranslation("LANGUAGE_EN"),
                        option: "en"
                    },
                    {
                        title: managers.translation.getTranslation("LANGUAGE_SV"),
                        option: "sv"
                    }
                ]
            }
        ],
        value: managers.translation.getLanguage()
    })))))));
}
exports.Modal = Modal;
;
