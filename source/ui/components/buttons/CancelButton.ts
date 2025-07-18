import { Managers } from "../../managers/Managers";
import { FormButton } from "../form/FormButton";
import { ButtonTitle } from "../titles/ButtonTitle";

export type CancelButton = {};

export function CancelButton(managers: Managers, attributes: CancelButton) {
	return (
		FormButton(managers, {
			onclick: async () => {
				await managers.backend.sendCommand({
					headers: {
						"x-preferred-language": managers.translation.getLanguage().value()
					},
					payload: {
						command: {
							type: "RESET_STATE"
						}
					}
				});
			}
		},
			ButtonTitle(managers, {}, managers.translation.getTranslation("CANCEL"))
		)
	);
};
