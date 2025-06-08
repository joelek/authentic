import { stateify } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { ResetStateButton } from "../buttons/ResetStateButton";
import { FormButton, FormGroup, FormInput } from "../form";
import { ButtonTitle, StepDescriptionTitle, StepHeaderTitle } from "../titles";
import { Step } from "./Step";

export type WaitingForRegisterPassphraseStep = {};

export function WaitingForRegisterPassphraseStep(managers: Managers, attributes: WaitingForRegisterPassphraseStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForRegisterPassphraseState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.WaitingForRegisterPassphraseState>);
	let value = stateify("");
	let input = FormInput(managers, {
		type: "password",
		placeholder: managers.translation.getTranslation("PASSPHRASE_PLACEHOLDER"),
		value
	});
	return (
		Step(managers, {
			type,
			reason
		},
			StepHeaderTitle(managers, {},
				managers.translation.getTranslation("REGISTER_BUTTON")
			),
			StepDescriptionTitle(managers, {}, managers.translation.getStateTranslation(type)),
			FormGroup(managers, {},
				input,
				FormButton(managers, {
					onclick: async () => {
						await managers.backend.sendCommand({
							payload: {
								command: {
									type: "REGISTER_PASSPHRASE",
									passphrase: value.value()
								}
							}
						});
						if (type.value() != null) {
							input.focus();
						}
					}
				},
					ButtonTitle(managers, {}, managers.translation.getTranslation("CONTINUE_BUTTON"))
				)
			),
			StepDescriptionTitle(managers, {}, managers.translation.getStateTranslation(reason)),
			ResetStateButton(managers, {})
		)
	);
};
