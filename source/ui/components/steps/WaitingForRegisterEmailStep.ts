import { html, stateify } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { Step } from "./Step";

export type WaitingForRegisterEmailStep = {};

export function WaitingForRegisterEmailStep(managers: Managers, attributes: WaitingForRegisterEmailStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForRegisterEmailState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.WaitingForRegisterEmailState>);
	let editable = managers.backend.getEditable().compute((editable) => editable ? undefined : "");
	let submittable = managers.backend.getSubmittable().compute((submittable) => submittable ? undefined : "");
	let value = stateify("");
	let input = html.input({
		disabled: editable,
		value
	});
	return (
		Step(managers, {
			type,
			reason
		},
			input,
			html.button({
				disabled: submittable,
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
				html.p({}, managers.translation.getTranslation("CONTINUE_BUTTON"))
			)
		)
	);
};
