import { stateify } from "@joelek/bonsai";

export type Theme = "dark" | "light";

export const StateManager = {
	create() {
		let visible = stateify<boolean>(false);
		let theme = stateify<Theme>("light");
		let modal_transition = stateify<boolean>(false);
		window.addEventListener("keyup", (event) => {
			if (event.key === "Escape") {
				visible.update(false);
			}
		});
		return {
			visible,
			theme,
			modal_transition
		};
	}
};

export type StateManager = ReturnType<typeof StateManager["create"]>;
