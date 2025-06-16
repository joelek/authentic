import { stateify } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { CancelButton } from "../buttons/CancelButton";
import { FormButton, FormGroup, FormInput } from "../form";
import { ButtonTitle, StepDescriptionTitle, StepHeaderTitle } from "../titles";
import { Step } from "./Step";

export type WaitingForRegisterEmailStep = {};

export function WaitingForRegisterEmailStep(managers: Managers, attributes: WaitingForRegisterEmailStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForRegisterEmailState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.WaitingForRegisterEmailState>);
	let value = stateify("");
	let input = FormInput(managers, {
		type: "email",
		placeholder: managers.translation.getTranslation("EMAIL_PLACEHOLDER"),
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
									type: "REGISTER_EMAIL",
									email: value.value()
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
			CancelButton(managers, {})
		)
	);
};
