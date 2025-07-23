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
		grid-template-columns: minmax(0%, 100%) auto;
	}

	.${CLASS_NAME}__title {
		padding: 6px;
	}

	.${CLASS_NAME}__body {

	}

	.${CLASS_NAME}__foot {
		padding: 24px;
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

export type Modal = {

};

export function Modal(managers: Managers, attributes: Modal) {
	let visible = managers.state.visible;
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
						class: [`${CLASS_NAME}__window`]
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
