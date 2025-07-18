import { html, State } from "@joelek/bonsai";
import * as api from "../api/client";
import { Client, createClient } from "../client";
import { Modal } from "./components/Modal";
import { Managers } from "./managers";

document.head.appendChild(html.style({}, `
	:root {
		--authentic-accent-color: rgb(223, 159, 31);
		--authentic-accent-color-bright: rgb(239, 175, 47);
	}
`));

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
	let element = Modal(managers, {});
	let visible = managers.state.visible;
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
		}
	};
	return {
		element,
		controller
	};
};
