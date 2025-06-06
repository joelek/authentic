import { html } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { Step } from "./Step";

export type RecoveredStep = {};

export function RecoveredStep(managers: Managers, attributes: RecoveredStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.RecoveredState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.RecoveredState>);
	let editable = managers.backend.getEditable().compute((editable) => editable ? undefined : "");
	let submittable = managers.backend.getSubmittable().compute((submittable) => submittable ? undefined : "");
	return (
		Step(managers, {
			type,
			reason
		},
			html.p({}, managers.translation.getTranslation("RECOVERED_TEXT"))
		)
	);
};
