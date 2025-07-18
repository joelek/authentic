import { Managers } from "../../managers/Managers";
import { FormButton } from "../form/FormButton";
import { ButtonTitle } from "../titles/ButtonTitle";

export type LogOutButton = {};

export function LogOutButton(managers: Managers, attributes: LogOutButton) {
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
			ButtonTitle(managers, {}, managers.translation.getTranslation("LOG_OUT"))
		)
	);
};
