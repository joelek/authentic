import { html } from "@joelek/bonsai";
import { Managers } from "../managers/Managers";
import { Block } from "./Block";
import { IconButton } from "./buttons/IconButton";
import { AuthenticatedStep } from "./steps/AuthenticatedStep";
import { WaitingForAuthenticateEmailStep } from "./steps/WaitingForAuthenticateEmailStep";
import { WaitingForAuthenticatePassphraseStep } from "./steps/WaitingForAuthenticatePassphraseStep";
import { WaitingForAuthenticateCodeStep } from "./steps/WaitingForAuthenticateCodeStep";
import { WaitingForAuthenticateUsernameStep } from "./steps/WaitingForAuthenticateUsernameStep";
import { WaitingForCommandStep } from "./steps/WaitingForCommandStep";
import { WaitingForRecoverEmailStep } from "./steps/WaitingForRecoverEmailStep";
import { WaitingForRecoverPassphraseStep } from "./steps/WaitingForRecoverPassphraseStep";
import { WaitingForRecoverCodeStep } from "./steps/WaitingForRecoverCodeStep";
import { WaitingForRecoverUsernameStep } from "./steps/WaitingForRecoverUsernameStep";
import { WaitingForRegisterEmailStep } from "./steps/WaitingForRegisterEmailStep";
import { WaitingForRegisterPassphraseStep } from "./steps/WaitingForRegisterPassphraseStep";
import { WaitingForRegisterCodeStep } from "./steps/WaitingForRegisterCodeStep";
import { WaitingForRegisterUsernameStep } from "./steps/WaitingForRegisterUsernameStep";
import { Language } from "../../api/client";
import { FormSelect } from "./form/FormSelect";
import { ModalTitle } from "./titles/ModalTitle";
import { RestartButton } from "./buttons/RestartButton";

const CLASS_NAME = "authentic-modal";

document.head.appendChild(html.style({}, `
	.${CLASS_NAME} {
		position: absolute;
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

export type Modal = {

};

export function Modal(managers: Managers, attributes: Modal) {
	let visible = managers.state.visible;
	let modal_transition = managers.state.modal_transition;
	return (
		Block("div", {
			class: [`${CLASS_NAME}`, visible.compute((visible) => visible ? `${CLASS_NAME}--visible` : `${CLASS_NAME}--hidden`)]
		},
			Block("div", {
				class: [`${CLASS_NAME}__background`]
			},
				Block("div", {
					class: [`${CLASS_NAME}__positioner`]
				},
					Block("div", {
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
					},
						Block("div", {
							class: [`${CLASS_NAME}__head`]
						},
							Block("div", {
								class: [`${CLASS_NAME}__title`]
							},
								ModalTitle(managers, {},
									managers.translation.getTranslation("MANAGE_ACCOUNT"),
								)
							),
							IconButton(managers, {
								graphic: "cross",
								onclick: () => {
									visible.update(!visible.value());
								}
							})
						),
						Block("div", {
							class: [`${CLASS_NAME}__body`]
						},
							Block("div", {
								class: [`${CLASS_NAME}__scroll`]
							},
								Block("div", {
									class: [`${CLASS_NAME}__content`]
								},
									AuthenticatedStep(managers, {}),
									WaitingForCommandStep(managers, {}),
									WaitingForAuthenticateEmailStep(managers, {}),
									WaitingForAuthenticatePassphraseStep(managers, {}),
									WaitingForAuthenticateCodeStep(managers, {}),
									WaitingForAuthenticateUsernameStep(managers, {}),
									WaitingForRecoverEmailStep(managers, {}),
									WaitingForRecoverPassphraseStep(managers, {}),
									WaitingForRecoverCodeStep(managers, {}),
									WaitingForRecoverUsernameStep(managers, {}),
									WaitingForRegisterEmailStep(managers, {}),
									WaitingForRegisterPassphraseStep(managers, {}),
									WaitingForRegisterCodeStep(managers, {}),
									WaitingForRegisterUsernameStep(managers, {})
								)
							)
						),
						Block("div", {
							class: [`${CLASS_NAME}__foot`]
						},
							RestartButton(managers, {}),
							FormSelect<Language>(managers, {
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
							})
						)
					)
				)
			)
		)
	);
};
