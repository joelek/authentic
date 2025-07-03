import { stateify } from "@joelek/bonsai";

export const StateManager = {
	create() {
		let visible = stateify<boolean>(false);
		return {
			 visible
		};
	}
};

export type StateManager = ReturnType<typeof StateManager["create"]>;
