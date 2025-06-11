import { stateify } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { CancelButton } from "../buttons/CancelButton";
import { FormButton, FormGroup, FormInput } from "../form";
import { ButtonTitle, StepDescriptionTitle, StepHeaderTitle } from "../titles";
import { Step } from "./Step";

export type WaitingForAuthenticateTokenStep = {};

export function WaitingForAuthenticateTokenStep(managers: Managers, attributes: WaitingForAuthenticateTokenStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForAuthenticateTokenState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.WaitingForAuthenticateTokenState>);
	let value = stateify("");
	let input = FormInput(managers, {
		type: "text",
		placeholder: managers.translation.getTranslation("TOKEN_PLACEHOLDER"),
		value
	});
	type.compute((type) => {
		if (type != null) {
			input.focus();
		}
	});
	return (
		Step(managers, {
			type,
			reason
		},
			StepHeaderTitle(managers, {},
				managers.translation.getTranslation("AUTHENTICATE_BUTTON")
			),
			StepDescriptionTitle(managers, {}, managers.translation.getStateTranslation(type)),
			FormGroup(managers, {},
				input,
				FormButton(managers, {
					onclick: async () => {
						await managers.backend.sendCommand({
							payload: {
								command: {
									type: "AUTHENTICATE_TOKEN",
									token: value.value()
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
