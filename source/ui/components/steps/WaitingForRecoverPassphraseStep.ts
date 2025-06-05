import { html, stateify } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { Step } from "./Step";

export type WaitingForRecoverPassphraseStep = {};

export function WaitingForRecoverPassphraseStep(managers: Managers, attributes: WaitingForRecoverPassphraseStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForRecoverPassphraseState.is(state) ? state : {} as Partial<api.WaitingForRecoverPassphraseState>);
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
								type: "RECOVER_PASSPHRASE",
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
