import { html } from "@joelek/bonsai";
import * as api from "../../../api";
import { Managers } from "../../managers/Managers";
import { Step } from "./Step";

export type AuthenticatedStep = {};

export function AuthenticatedStep(managers: Managers, attributes: AuthenticatedStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForCommandState.is(state) ? state : {} as Partial<api.WaitingForCommandState>);
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
