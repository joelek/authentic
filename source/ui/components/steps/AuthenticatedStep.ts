import { html } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { StepTitle } from "../titles";
import { Step } from "./Step";

export type AuthenticatedStep = {};

export function AuthenticatedStep(managers: Managers, attributes: AuthenticatedStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.AuthenticatedState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.AuthenticatedState>);
	let editable = managers.backend.getEditable().compute((editable) => editable ? undefined : "");
	let submittable = managers.backend.getSubmittable().compute((submittable) => submittable ? undefined : "");
	return (
		Step(managers, {
			type,
			reason
		},
			StepTitle(managers, {},
				managers.translation.getTranslation("AUTHENTICATE_BUTTON")
			),
			html.p({}, managers.translation.getTranslation("AUTHENTICATED_TEXT"))
		)
	);
};
