import { Managers } from "../../managers/Managers";
import { FormButton } from "../form/FormButton";
import { Icon } from "../Icon";

export type IconButton = FormButton & {
	graphic: Icon["graphic"];
};

export function IconButton(managers: Managers, { graphic, ...rest }: IconButton) {
	return (
		FormButton(managers, rest,
			Icon(managers, {
				graphic: graphic,
				size: "20px"
			})
		)
	);
};
