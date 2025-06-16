import { State, stateify } from "@joelek/bonsai";
import * as api from "../api/client";
import { Client, createClient } from "../client";
import { Modal } from "./components";
import { Managers } from "./managers";

export type UIOptions = {
	client?: Client;
};

export interface InterfaceManager {
	logout(): Promise<void>;
	toggle(): void;
	getUser(): State<api.User | undefined>;
};

export function injectUserInterface(options?: UIOptions): InterfaceManager {
	let client = options?.client ?? createClient();
	let managers = Managers.create(client);
	let visible = stateify(false as boolean);
	document.body.appendChild(Modal(managers, { visible }));
	return {
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
};
