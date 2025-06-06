import { html, stateify } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { Step } from "./Step";

export type WaitingForRegisterPassphraseStep = {};

export function WaitingForRegisterPassphraseStep(managers: Managers, attributes: WaitingForRegisterPassphraseStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForRegisterPassphraseState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.WaitingForRegisterPassphraseState>);
	let editable = managers.backend.getEditable().compute((editable) => editable ? undefined : "");
	let submittable = managers.backend.getSubmittable().compute((submittable) => submittable ? undefined : "");
	let value = stateify("");
	return (
		Step(managers, {
			type,
			reason
		},
			html.input({
				disabled: editable,
				value
			}),
			html.button({
				disabled: submittable,
				onclick: async () => {
					await managers.backend.sendCommand({
						payload: {
							command: {
								type: "REGISTER_PASSPHRASE",
								passphrase: value.value()
							}
						}
					});
				}
			},
				html.p({}, managers.translation.getTranslation("CONTINUE_BUTTON"))
			)
		)
	);
};
