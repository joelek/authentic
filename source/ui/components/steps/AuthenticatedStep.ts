import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { LogOutButton } from "../buttons";
import { FormGroup } from "../form";
import { StepDescriptionTitle, StepHeaderTitle } from "../titles";
import { Step } from "./Step";

export type AuthenticatedStep = {};

export function AuthenticatedStep(managers: Managers, attributes: AuthenticatedStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.AuthenticatedState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.AuthenticatedState>);
	let user = managers.backend.getUser();
	let { id, email, username } = user.compute((user) => user != null ? user : { id: undefined, email: undefined, username: undefined } as Partial<api.User>);
	return (
		Step(managers, {
			type,
			reason
		},
			StepHeaderTitle(managers, {}, managers.translation.getTranslation("LOGGED_IN_AS")),
			FormGroup(managers, {},
				StepDescriptionTitle(managers, {}, email),
				LogOutButton(managers, {})
			)
		)
	);
};
