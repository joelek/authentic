import { html } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
import { Step } from "./Step";

export type RegisteredStep = {};

export function RegisteredStep(managers: Managers, attributes: RegisteredStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.RegisteredState.is(state) ? state : { type: undefined, reason: undefined } as Partial<api.RegisteredState>);
	let disabled = managers.backend.getPending().compute((pending) => pending ? "" : undefined);
	return (
		Step(managers, {
			type,
			reason
		},
			html.p({}, managers.translation.getTranslation("REGISTERED_TEXT"))
		)
	);
};
