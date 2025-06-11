import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { LogOutButton } from "../buttons";
import { FormGroup } from "../form";
import { StepDescriptionTitle, StepHeaderTitle } from "../titles";
import { Step } from "./Step";

export type RecoveredStep = {};

export function RecoveredStep(managers: Managers, attributes: RecoveredStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.RecoveredState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.RecoveredState>);
	let user = managers.backend.getUser();
	let { id, email, username } = user.compute((user) => user != null ? user : { id: undefined, email: undefined, username: undefined } as Partial<api.User>);
	return (
		Step(managers, {
			type,
			reason
		},
			StepHeaderTitle(managers, {},
				managers.translation.getTranslation("RECOVER_BUTTON")
			),
			StepDescriptionTitle(managers, {}, managers.translation.getStateTranslation(type)),
			FormGroup(managers, {},
				StepDescriptionTitle(managers, {}, email),
				LogOutButton(managers, {})
			)
		)
	);
};
