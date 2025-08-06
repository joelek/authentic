import { stateify } from "@joelek/bonsai";

export type Theme = "dark" | "light";

export const StateManager = {
	create() {
		let visible = stateify<boolean>(false);
		let theme = stateify<Theme>("light");
		return {
			 visible,
			 theme
		};
	}
};

export type StateManager = ReturnType<typeof StateManager["create"]>;
