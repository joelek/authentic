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

export type WaitingForRecoverCodeStep = {};

export function WaitingForRecoverCodeStep(managers: Managers, attributes: WaitingForRecoverCodeStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForRecoverCodeState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.WaitingForRecoverCodeState>);
	let value = stateify("");
	let input = FormInput(managers, {
		type: "text",
		placeholder: managers.translation.getTranslation("CODE_PLACEHOLDER"),
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
			StepHeaderTitle(managers, {}, managers.translation.getTranslation("RECOVER_ACCOUNT")),
			StepDescriptionTitle(managers, {}, managers.translation.getStateTranslation(type)),
			FormGroup(managers, {},
				input,
				FormButton(managers, {
					onclick: async () => {
						await managers.backend.sendCommand({
							headers: {
								"x-preferred-language": managers.translation.getLanguage().value()
							},
							payload: {
								command: {
									type: "RECOVER_CODE",
									code: value.value()
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
