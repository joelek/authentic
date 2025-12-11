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

export type WaitingForAuthenticatePassphraseStep = {};

export function WaitingForAuthenticatePassphraseStep(managers: Managers, attributes: WaitingForAuthenticatePassphraseStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForAuthenticatePassphraseState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.WaitingForAuthenticatePassphraseState>);
	let value = stateify("");
	let input = FormInput(managers, {
		type: "password",
		enabled: managers.backend.getEditable(),
		placeholder: managers.translation.getTranslation("PASSPHRASE_PLACEHOLDER"),
		onkeyup: (event) => {
			if (event.key === "Enter") {
				button.click();
			}
		},
		value
	});
	let button = FormButton(managers, {
		enabled: managers.backend.getSubmittable(),
		primary: true,
		onclick: async () => {
			await managers.backend.sendCommand({
				headers: {
					"x-preferred-language": managers.translation.getLanguage().value()
				},
				payload: {
					command: {
						type: "AUTHENTICATE_PASSPHRASE",
						passphrase: value.value()
					}
				}
			});
			if (type.value() != null) {
				input.focus();
			}
		}
	},
		ButtonTitle(managers, {}, managers.translation.getTranslation("CONTINUE"))
	);
	return (
		Step(managers, {
			type,
			reason,
			ontransition: (state) => {
				if (state === "start") {
					value.update("");
				} else {
					input.focus();
				}
			}
		},
			StepHeaderTitle(managers, {}, managers.translation.getTranslation("AUTHENTICATE_ACCOUNT")),
			StepDescriptionTitle(managers, {}, managers.translation.getStateTranslation(type)),
			FormGroup(managers, {},
				input,
				button
			),
			StepDescriptionTitle(managers, {}, managers.translation.getStateTranslation(reason))
		)
	);
};
