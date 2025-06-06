import { html } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { Step } from "./Step";

export type WaitingForCommandStep = {};

export function WaitingForCommandStep(managers: Managers, attributes: WaitingForCommandStep) {
	let state = managers.backend.getState();
	state.compute(console.log);
	let { type, reason } = state.compute((state) => api.WaitingForCommandState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.WaitingForCommandState>);
	type.compute(console.log);
	reason.compute(console.log);
	let editable = managers.backend.getEditable().compute((editable) => editable ? undefined : "");
	let submittable = managers.backend.getSubmittable().compute((submittable) => submittable ? undefined : "");
	return (
		Step(managers, {
			type,
			reason
		},
			html.button({
				disabled: submittable,
				onclick: async () => {
					await managers.backend.sendCommand({
						payload: {
							command: {
								type: "REGISTER"
							}
						}
					});
				}
			},
				html.p({}, managers.translation.getTranslation("REGISTER_BUTTON"))
			),
			html.button({
				disabled: submittable,
				onclick: async () => {
					await managers.backend.sendCommand({
						payload: {
							command: {
								type: "AUTHENTICATE"
							}
						}
					});
				}
			},
				html.p({}, managers.translation.getTranslation("AUTHENTICATE_BUTTON"))
			),
			html.button({
				disabled: submittable,
				onclick: async () => {
					await managers.backend.sendCommand({
						payload: {
							command: {
								type: "RECOVER"
							}
						}
					});
				}
			},
				html.p({}, managers.translation.getTranslation("RECOVER_BUTTON"))
			)
		)
	);
};
