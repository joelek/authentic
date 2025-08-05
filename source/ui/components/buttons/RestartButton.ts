import { Managers } from "../../managers/Managers";
import { FormButton } from "../form/FormButton";
import { ButtonTitle } from "../titles/ButtonTitle";

export type RestartButton = {};

export function RestartButton(managers: Managers, attributes: RestartButton) {
	return (
		FormButton(managers, {
			enabled: managers.backend.getSubmittable(),
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
			ButtonTitle(managers, {}, managers.translation.getTranslation("RESTART"))
		)
	);
};
