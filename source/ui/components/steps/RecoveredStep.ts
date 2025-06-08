import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { StepDescriptionTitle, StepHeaderTitle } from "../titles";
import { Step } from "./Step";

export type RecoveredStep = {};

export function RecoveredStep(managers: Managers, attributes: RecoveredStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.RecoveredState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.RecoveredState>);
	return (
		Step(managers, {
			type,
			reason
		},
			StepHeaderTitle(managers, {},
				managers.translation.getTranslation("RECOVER_BUTTON")
			),
			StepDescriptionTitle(managers, {}, managers.translation.getStateTranslation(type))
		)
	);
};
