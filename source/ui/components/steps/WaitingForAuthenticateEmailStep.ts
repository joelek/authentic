import { html, stateify } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { Step } from "./Step";

export type WaitingForAuthenticateEmailStep = {};

export function WaitingForAuthenticateEmailStep(managers: Managers, attributes: WaitingForAuthenticateEmailStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForAuthenticateEmailState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.WaitingForAuthenticateEmailState>);
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
								type: "AUTHENTICATE_EMAIL",
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
