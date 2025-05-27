import { stateify } from "@joelek/bonsai";
import { Modal } from "./components";
import { Managers } from "./managers";
import * as client from "../client";

export interface Interface {
	toggle(): void;
};

export function inject(): Interface {
	let managers = Managers.create(client.createClient());
	let visible = stateify(false as boolean);
	document.body.appendChild(Modal(managers, { visible }));
	return {
		toggle: () => {
			visible.update(!visible.value());
		}
	};
};
