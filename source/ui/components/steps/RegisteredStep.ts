import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { StepDescriptionTitle, StepHeaderTitle } from "../titles";
import { Step } from "./Step";

export type RegisteredStep = {};

export function RegisteredStep(managers: Managers, attributes: RegisteredStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.RegisteredState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.RegisteredState>);
	return (
		Step(managers, {
			type,
			reason
		},
			StepHeaderTitle(managers, {},
				managers.translation.getTranslation("REGISTER_BUTTON")
			),
			StepDescriptionTitle(managers, {}, managers.translation.getStateTranslation(type))
		)
	);
};
