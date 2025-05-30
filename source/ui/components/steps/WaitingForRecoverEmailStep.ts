import { html, stateify } from "@joelek/bonsai";
import * as api from "../../../api";
import { Managers } from "../../managers/Managers";
import { Step } from "./Step";

export type WaitingForRecoverEmailStep = {};

export function WaitingForRecoverEmailStep(managers: Managers, attributes: WaitingForRecoverEmailStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForCommandState.is(state) ? state : {} as Partial<api.WaitingForCommandState>);
	let disabled = managers.backend.getPending().compute((pending) => pending ? "" : undefined);
	let value = stateify("");
	return (
		Step(managers, {
			type,
			reason
		},
			html.input({
				disabled,
				value
			}),
			html.button({
				disabled,
				onclick: async () => {
					await managers.backend.sendCommand({
						payload: {
							command: {
								type: "RECOVER_EMAIL",
								email: value.value()
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
