import { State } from "@joelek/bonsai";
import * as api from "../api/client";
import { Client, createClient } from "../client";
import { Modal } from "./components/Modal";
import { Variables } from "./components/Variables";
import { Managers, Theme } from "./managers";

export type UIOptions = {
	client?: Client;
};

export interface Controller {
	logout(): Promise<void>;
	toggle(): void;
	getUser(): State<api.User | undefined>;
	getTheme(): State<Theme>;
};

export function createElementAndController(options?: UIOptions): {
	element: HTMLElement;
	controller: Controller;
} {
	let client = options?.client ?? createClient();
	let managers = Managers.create(client);
	let element = Variables(managers, {}, Modal(managers, {}));
	let visible = managers.state.visible;
	let theme = managers.state.theme;
	let controller: Controller = {
		logout: async () => {
			await managers.backend.sendCommand({
				headers: {
					"x-preferred-language": managers.translation.getLanguage().value()
				},
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
		},
		getTheme: () => {
			return theme;
		}
	};
	return {
		element,
		controller
	};
};
