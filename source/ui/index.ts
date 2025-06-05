import { stateify } from "@joelek/bonsai";
import { Client, createClient } from "../client";
import { Modal } from "./components";
import { Managers } from "./managers";

export type UIOptions = {
	client?: Client;
};

export interface Interface {
	toggle(): void;
};

export function injectUserInterface(options?: UIOptions): Interface {
	let client = options?.client ?? createClient();
	let managers = Managers.create(client);
	let visible = stateify(false as boolean);
	document.body.appendChild(Modal(managers, { visible }));
	return {
		toggle: () => {
			visible.update(!visible.value());
		}
	};
};
