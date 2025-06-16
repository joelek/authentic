import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { FormButton, FormGroup } from "../form";
import { ButtonTitle } from "../titles";
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
			FormGroup(managers, {},
				FormButton(managers, {
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
					ButtonTitle(managers, {}, managers.translation.getTranslation("REGISTER_ACCOUNT"))
				),
				FormButton(managers, {
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
					ButtonTitle(managers, {}, managers.translation.getTranslation("AUTHENTICATE_ACCOUNT"))
				),
				FormButton(managers, {
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
					ButtonTitle(managers, {}, managers.translation.getTranslation("RECOVER_ACCOUNT"))
				)
			)
		)
	);
};
