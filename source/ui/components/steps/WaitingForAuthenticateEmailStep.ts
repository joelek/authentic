import { stateify } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { CancelButton } from "../buttons/CancelButton";
import { FormButton } from "../form/FormButton";
import { FormGroup } from "../form/FormGroup";
import { FormInput } from "../form/FormInput";
import { ButtonTitle } from "../titles/ButtonTitle";
import { StepDescriptionTitle } from "../titles/StepDescriptionTitle";
import { StepHeaderTitle } from "../titles/StepHeaderTitle";
import { Step } from "./Step";

export type WaitingForAuthenticateEmailStep = {};

export function WaitingForAuthenticateEmailStep(managers: Managers, attributes: WaitingForAuthenticateEmailStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForAuthenticateEmailState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.WaitingForAuthenticateEmailState>);
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
			StepHeaderTitle(managers, {}, managers.translation.getTranslation("AUTHENTICATE_ACCOUNT")),
			StepDescriptionTitle(managers, {}, managers.translation.getStateTranslation(type)),
			FormGroup(managers, {},
				input,
				FormButton(managers, {
					onclick: async () => {
						await managers.backend.sendCommand({
							payload: {
								command: {
									type: "AUTHENTICATE_EMAIL",
									email: value.value()
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
