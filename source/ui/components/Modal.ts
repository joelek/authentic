import { html, State, stateify } from "@joelek/bonsai";
import { Managers } from "../managers/Managers";
import { Block } from "./Block";
import { IconButton } from "./buttons/IconButton";
import { AuthenticatedStep, WaitingForAuthenticateEmailStep, WaitingForAuthenticatePassphraseStep, WaitingForAuthenticateTokenStep, WaitingForAuthenticateUsernameStep, WaitingForRecoverEmailStep, WaitingForRecoverPassphraseStep, WaitingForRecoverTokenStep, WaitingForRecoverUsernameStep, WaitingForRegisterEmailStep, WaitingForRegisterPassphraseStep, WaitingForRegisterTokenStep, WaitingForRegisterUsernameStep } from "./steps";
import { WaitingForCommandStep } from "./steps/WaitingForCommandStep";

document.head.appendChild(html.style({}, `
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
		border-radius: 4px;
		display: grid;
		grid-template-rows: auto minmax(0%, 100%) auto;
	}

	.modal__head {
		align-items: center;
		background-color: rgb(63, 63, 63);
		display: grid;
		grid-template-columns: auto;
		justify-content: end;
	}

	.modal__body {

	}

	.modal__foot {

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

export type Modal = {
	visible: State<boolean>;
};

export function Modal(managers: Managers, attributes: Modal) {
	let visible = stateify(attributes.visible);
	return (
		Block("div", {
			class: ["modal", visible.compute((visible) => visible ? "modal--visible" : "modal--hidden")]
		},
			Block("div", {
				class: ["modal__background"]
			},
				Block("div", {
					class: ["modal__positioner"]
				},
					Block("div", {
						class: ["modal__window"]
					},
						Block("div", {
							class: ["modal__head"]
						},
							IconButton(managers, {
								icon: "cross",
								onclick: () => {
									visible.update(!visible.value());
								}
							})
						),
						Block("div", {
							class: ["modal__body"]
						},
							Block("div", {
								class: ["modal__scroll"]
							},
								Block("div", {
									class: ["modal__content"]
								},
									AuthenticatedStep(managers, {}),
									WaitingForCommandStep(managers, {}),
									WaitingForAuthenticateEmailStep(managers, {}),
									WaitingForAuthenticatePassphraseStep(managers, {}),
									WaitingForAuthenticateTokenStep(managers, {}),
									WaitingForAuthenticateUsernameStep(managers, {}),
									WaitingForRecoverEmailStep(managers, {}),
									WaitingForRecoverPassphraseStep(managers, {}),
									WaitingForRecoverTokenStep(managers, {}),
									WaitingForRecoverUsernameStep(managers, {}),
									WaitingForRegisterEmailStep(managers, {}),
									WaitingForRegisterPassphraseStep(managers, {}),
									WaitingForRegisterTokenStep(managers, {}),
									WaitingForRegisterUsernameStep(managers, {})
								)
							)
						),
						Block("div", {
							class: ["modal__foot"]
						}

						)
					)
				)
			)
		)
	);
};
