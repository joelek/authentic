import { Managers } from "../../managers/Managers";
import { FormButton } from "../form/FormButton";
import { ButtonTitle } from "../titles";

export type ResetStateButton = {};

export function ResetStateButton(managers: Managers, attributes: ResetStateButton) {
	return (
		FormButton(managers, {
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
			ButtonTitle(managers, {}, managers.translation.getTranslation("RESET_STATE_BUTTON"))
		)
	);
};
