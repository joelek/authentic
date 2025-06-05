import { html } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { Step } from "./Step";

export type AuthenticatedStep = {};

export function AuthenticatedStep(managers: Managers, attributes: AuthenticatedStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.AuthenticatedState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.AuthenticatedState>);
	let disabled = managers.backend.getPending().compute((pending) => pending ? "" : undefined);
	return (
		Step(managers, {
			type,
			reason
		},
			html.p({}, managers.translation.getTranslation("AUTHENTICATED_TEXT"))
		)
	);
};
