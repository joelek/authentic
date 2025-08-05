import { stateify } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { RestartButton } from "../buttons/RestartButton";
import { FormButton } from "../form/FormButton";
import { FormGroup } from "../form/FormGroup";
import { FormInput } from "../form/FormInput";
import { ButtonTitle } from "../titles/ButtonTitle";
import { StepDescriptionTitle } from "../titles/StepDescriptionTitle";
import { StepHeaderTitle } from "../titles/StepHeaderTitle";
import { Step } from "./Step";

export type WaitingForRegisterEmailStep = {};

export function WaitingForRegisterEmailStep(managers: Managers, attributes: WaitingForRegisterEmailStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForRegisterEmailState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.WaitingForRegisterEmailState>);
	let value = stateify("");
	let input = FormInput(managers, {
		type: "email",
		enabled: managers.backend.getEditable(),
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
			StepHeaderTitle(managers, {}, managers.translation.getTranslation("REGISTER_ACCOUNT")),
			StepDescriptionTitle(managers, {}, managers.translation.getStateTranslation(type)),
			FormGroup(managers, {},
				input,
				FormButton(managers, {
					enabled: managers.backend.getSubmittable(),
					onclick: async () => {
						await managers.backend.sendCommand({
							headers: {
								"x-preferred-language": managers.translation.getLanguage().value()
							},
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
					ButtonTitle(managers, {}, managers.translation.getTranslation("CONTINUE"))
				)
			),
			StepDescriptionTitle(managers, {}, managers.translation.getStateTranslation(reason)),
			RestartButton(managers, {})
		)
	);
};
