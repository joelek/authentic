import { html, stateify } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { Step } from "./Step";

export type WaitingForRecoverTokenStep = {};

export function WaitingForRecoverTokenStep(managers: Managers, attributes: WaitingForRecoverTokenStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForRecoverTokenState.is(state) ? state : {} as Partial<api.WaitingForRecoverTokenState>);
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
								type: "RECOVER_TOKEN",
								token: value.value()
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
