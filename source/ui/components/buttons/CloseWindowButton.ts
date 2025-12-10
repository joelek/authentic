import { Managers } from "../../managers/Managers";
import { FormButton } from "../form/FormButton";
import { ButtonTitle } from "../titles/ButtonTitle";

export type CloseWindowButton = {};

export function CloseWindowButton(managers: Managers, attributes: CloseWindowButton) {
	return (
		FormButton(managers, {
			primary: true,
			onclick: async () => {
				managers.state.visible.update(false);
			}
		},
			ButtonTitle(managers, {}, managers.translation.getTranslation("CLOSE_WINDOW"))
		)
	);
};
