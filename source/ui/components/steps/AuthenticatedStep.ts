import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { StepDescriptionTitle, StepHeaderTitle } from "../titles";
import { Step } from "./Step";

export type AuthenticatedStep = {};

export function AuthenticatedStep(managers: Managers, attributes: AuthenticatedStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.AuthenticatedState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.AuthenticatedState>);
	return (
		Step(managers, {
			type,
			reason
		},
			StepHeaderTitle(managers, {},
				managers.translation.getTranslation("AUTHENTICATE_BUTTON")
			),
			StepDescriptionTitle(managers, {}, managers.translation.getStateTranslation(type))
		)
	);
};
