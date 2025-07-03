import { State, stateify } from "@joelek/bonsai";
import * as api from "../api/client";
import { Client, createClient } from "../client";
import { Modal } from "./components/Modal";
import { Managers } from "./managers";

export type UIOptions = {
	client?: Client;
};

export interface Controller {
	logout(): Promise<void>;
	toggle(): void;
	getUser(): State<api.User | undefined>;
};

export function createElementAndController(options?: UIOptions): {
	element: HTMLElement;
	controller: Controller;
} {
	let client = options?.client ?? createClient();
	let managers = Managers.create(client);
	let visible = stateify(false as boolean);
	let element = Modal(managers, { visible });
	let controller: Controller = {
		logout: async () => {
			await managers.backend.sendCommand({
				payload: {
					command: {
						type: "RESET_STATE"
					}
				}
			});
		},
		toggle: () => {
			visible.update(!visible.value());
		},
		getUser: () => {
			return managers.backend.getUser();
		}
	};
	return {
		element,
		controller
	};
};
