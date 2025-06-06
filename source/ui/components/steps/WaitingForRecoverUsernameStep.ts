import { html, stateify } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { StepTitle } from "../titles";
import { Step } from "./Step";

export type WaitingForRecoverUsernameStep = {};

export function WaitingForRecoverUsernameStep(managers: Managers, attributes: WaitingForRecoverUsernameStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForRecoverUsernameState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.WaitingForRecoverUsernameState>);
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
			StepTitle(managers, {},
				managers.translation.getTranslation("RECOVER_BUTTON")
			),
			input,
			html.button({
				disabled: submittable,
				onclick: async () => {
					await managers.backend.sendCommand({
						payload: {
							command: {
								type: "RECOVER_USERNAME",
								username: value.value()
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
