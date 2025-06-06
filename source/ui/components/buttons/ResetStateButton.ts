import { html } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";

export type ResetStateButton = {};

export function ResetStateButton(managers: Managers, attributes: ResetStateButton) {
	let submittable = managers.backend.getSubmittable().compute((submittable) => submittable ? undefined : "");
	return (
		html.button({
			disabled: submittable,
			onclick: async () => {
				await managers.backend.sendCommand({
					payload: {
						command: {
							type: "RESET_STATE"
						}
					}
				});
			}
		},
			html.p({}, managers.translation.getTranslation("RESET_STATE_BUTTON"))
		)
	);
};
