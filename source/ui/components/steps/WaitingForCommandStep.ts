import { html } from "@joelek/bonsai";
import * as api from "../../../api";
import { Managers } from "../../managers/Managers";
import { Step } from "./Step";

export type WaitingForCommandStep = {};

export function WaitingForCommandStep(managers: Managers, attributes: WaitingForCommandStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForCommandState.is(state) ? state : {} as Partial<api.WaitingForCommandState>);
	return (
		Step(managers, {
			type,
			reason
		},

		)
	);
};
