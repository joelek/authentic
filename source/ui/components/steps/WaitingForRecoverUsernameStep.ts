import { stateify } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { CancelButton } from "../buttons/CancelButton";
import { FormButton, FormGroup, FormInput } from "../form";
import { ButtonTitle, StepDescriptionTitle, StepHeaderTitle } from "../titles";
import { Step } from "./Step";

export type WaitingForRecoverUsernameStep = {};

export function WaitingForRecoverUsernameStep(managers: Managers, attributes: WaitingForRecoverUsernameStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForRecoverUsernameState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.WaitingForRecoverUsernameState>);
	let value = stateify("");
	let input = FormInput(managers, {
		type: "text",
		placeholder: managers.translation.getTranslation("USERNAME_PLACEHOLDER"),
		value
	});
	type.compute((type) => {
		if (type != null) {
			input.focus();
		} else {
			value.update("");
		}
	});
	return (
		Step(managers, {
			type,
			reason
		},
			StepHeaderTitle(managers, {},
				managers.translation.getTranslation("RECOVER_ACCOUNT")
			),
			StepDescriptionTitle(managers, {}, managers.translation.getStateTranslation(type)),
			FormGroup(managers, {},
				input,
				FormButton(managers, {
					onclick: async () => {
						await managers.backend.sendCommand({
							payload: {
								command: {
									type: "RECOVER_USERNAME",
									username: value.value()
								}
							}
						});
						if (type.value() != null) {
							input.focus();
						}
					}
				},
					ButtonTitle(managers, {}, managers.translation.getTranslation("CONTINUE"))
				)
			),
			StepDescriptionTitle(managers, {}, managers.translation.getStateTranslation(reason)),
			CancelButton(managers, {})
		)
	);
};
