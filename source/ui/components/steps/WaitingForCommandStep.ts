import { html, State, stateify } from "@joelek/bonsai";
import * as api from "../../../api";
import { Managers } from "../../managers/Managers";
import { Step } from "./Step";

export type WaitingForCommandStep = {};

export function WaitingForCommandStep(managers: Managers, attributes: WaitingForCommandStep) {
	let state = managers.backend.getState();
	let { type, reason } = state.compute((state) => api.WaitingForCommandState.is(state) ? state : {} as Partial<api.WaitingForCommandState>);
	return (
		Step(managers, {
			visible: type.compute((type) => type != null)
		},
			html.p({}, managers.translation.getTranslation(reason))
		)
	);
};
