import { stateify } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { FormButton } from "../form/FormButton";
import { FormGroup } from "../form/FormGroup";
import { FormInput } from "../form/FormInput";
import { ButtonTitle } from "../titles/ButtonTitle";
import { StepDescriptionTitle } from "../titles/StepDescriptionTitle";
import { StepHeaderTitle } from "../titles/StepHeaderTitle";
import { Step } from "./Step";

export type WaitingForRegisterUsernameStep = {};

export function WaitingForRegisterUsernameStep(managers: Managers, attributes: WaitingForRegisterUsernameStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForRegisterUsernameState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.WaitingForRegisterUsernameState>);
	let value = stateify("");
	let input = FormInput(managers, {
		type: "text",
		enabled: managers.backend.getEditable(),
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
									type: "REGISTER_USERNAME",
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
			StepDescriptionTitle(managers, {}, managers.translation.getStateTranslation(reason))
		)
	);
};
