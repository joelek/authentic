import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { FormButton } from "../form/FormButton";
import { FormGroup } from "../form/FormGroup";
import { ButtonTitle } from "../titles/ButtonTitle";
import { StepDescriptionTitle } from "../titles/StepDescriptionTitle";
import { StepHeaderTitle } from "../titles/StepHeaderTitle";
import { Step } from "./Step";

export type WaitingForCommandStep = {};

export function WaitingForCommandStep(managers: Managers, attributes: WaitingForCommandStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForCommandState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.WaitingForCommandState>);
	return (
		Step(managers, {
			type,
			reason
		},
			StepHeaderTitle(managers, {}, managers.translation.getTranslation("MANAGE_ACCOUNT")),
			StepDescriptionTitle(managers, {}, managers.translation.getStateTranslation(type)),
			FormGroup(managers, {},
				FormButton(managers, {
					enabled: managers.backend.getSubmittable(),
					primary: true,
					onclick: async () => {
						await managers.backend.sendCommand({
							headers: {
								"x-preferred-language": managers.translation.getLanguage().value()
							},
							payload: {
								command: {
									type: "REGISTER"
								}
							}
						});
					}
				},
					ButtonTitle(managers, {}, managers.translation.getTranslation("REGISTER_ACCOUNT"))
				),
				FormButton(managers, {
					enabled: managers.backend.getSubmittable(),
					primary: true,
					onclick: async () => {
						await managers.backend.sendCommand({
							headers: {
								"x-preferred-language": managers.translation.getLanguage().value()
							},
							payload: {
								command: {
									type: "AUTHENTICATE"
								}
							}
						});
					}
				},
					ButtonTitle(managers, {}, managers.translation.getTranslation("AUTHENTICATE_ACCOUNT"))
				),
				FormButton(managers, {
					enabled: managers.backend.getSubmittable(),
					primary: true,
					onclick: async () => {
						await managers.backend.sendCommand({
							headers: {
								"x-preferred-language": managers.translation.getLanguage().value()
							},
							payload: {
								command: {
									type: "RECOVER"
								}
							}
						});
					}
				},
					ButtonTitle(managers, {}, managers.translation.getTranslation("RECOVER_ACCOUNT"))
				)
			)
		)
	);
};
