import { stateify } from "@joelek/bonsai";

export type Theme = "dark" | "light";

export type HideShow = "hide" | "show";

export const StateManager = {
	create() {
		let visible = stateify<boolean>(false);
		let passwords = stateify<HideShow>("hide");
		let theme = stateify<Theme>("light");
		let modal_transition = stateify<boolean>(false);
		window.addEventListener("keyup", (event) => {
			if (event.key === "Escape") {
				visible.update(false);
			}
		});
		return {
			visible,
			passwords,
			theme,
			modal_transition
		};
	}
};

export type StateManager = ReturnType<typeof StateManager["create"]>;
