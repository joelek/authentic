import { html, State, stateify } from "@joelek/bonsai";
import { Managers } from "../managers/Managers";
import { AuthenticatedStep, RecoveredStep, RegisteredStep, WaitingForAuthenticateEmailStep, WaitingForAuthenticatePassphraseStep, WaitingForAuthenticateTokenStep, WaitingForAuthenticateUsernameStep, WaitingForRecoverEmailStep, WaitingForRecoverPassphraseStep, WaitingForRecoverTokenStep, WaitingForRecoverUsernameStep, WaitingForRegisterEmailStep, WaitingForRegisterPassphraseStep, WaitingForRegisterTokenStep, WaitingForRegisterUsernameStep } from "./steps";
import { WaitingForCommandStep } from "./steps/WaitingForCommandStep";

document.head.appendChild(html.style({}, `\
	.modal {

	}

	.modal--visible {

	}

	.modal--hidden {
		display: none;
	}
`));

export type Modal = {
	visible: State<boolean>;
};

export function Modal(managers: Managers, attributes: Modal) {
	let visible = stateify(attributes.visible);
	return (
		html.div({
			class: ["modal", visible.compute((visible) => visible ? "modal--visible" : "modal--hidden")]
		},
			WaitingForCommandStep(managers, {}),
			WaitingForAuthenticateEmailStep(managers, {}),
			WaitingForAuthenticatePassphraseStep(managers, {}),
			WaitingForAuthenticateTokenStep(managers, {}),
			WaitingForAuthenticateUsernameStep(managers, {}),
			AuthenticatedStep(managers, {}),
			WaitingForRecoverEmailStep(managers, {}),
			WaitingForRecoverPassphraseStep(managers, {}),
			WaitingForRecoverTokenStep(managers, {}),
			WaitingForRecoverUsernameStep(managers, {}),
			RecoveredStep(managers, {}),
			WaitingForRegisterEmailStep(managers, {}),
			WaitingForRegisterPassphraseStep(managers, {}),
			WaitingForRegisterTokenStep(managers, {}),
			WaitingForRegisterUsernameStep(managers, {}),
			RegisteredStep(managers, {})
		)
	);
};
