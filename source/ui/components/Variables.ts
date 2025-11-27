import { Children, html } from "@joelek/bonsai";
import { Managers } from "../managers/Managers";
import { Block } from "./Block";

const CLASS_NAME = "authentic-variables";

document.head.appendChild(html.style({}, `
	.${CLASS_NAME} {
		display: contents;
	}

	.${CLASS_NAME} {
		--authentic-accent-color: rgb(31, 159, 223);
		--authentic-accent-color-bright: rgb(47, 175, 239);
	}

	.${CLASS_NAME}--light {
		--authentic-scrollbar-color: rgb(223, 223, 223);
		--authentic-active-scrollbar-color: rgb(191, 191, 191);

		--authentic-window-bg-color: rgb(239, 239, 239);
		--authentic-window-fg-color: rgb(0, 0, 0);

		--authentic-primary-button-bg-color: var(--authentic-accent-color);
		--authentic-primary-button-border-color: transparent;
		--authentic-primary-button-fg-color: rgb(255, 255, 255);

		--authentic-active-primary-button-bg-color: var(--authentic-accent-color-bright);
		--authentic-active-primary-button-border-color: transparent;
		--authentic-active-primary-button-fg-color: rgb(255, 255, 255);

		--authentic-secondary-button-bg-color: transparent;
		--authentic-secondary-button-border-color: transparent;
		--authentic-secondary-button-fg-color: rgb(0, 0, 0);

		--authentic-active-secondary-button-bg-color: rgb(255, 255, 255);
		--authentic-active-secondary-button-border-color: transparent;
		--authentic-active-secondary-button-fg-color: rgb(0, 0, 0);

		--authentic-input-bg-color: rgb(255, 255, 255);
		--authentic-input-border-color: rgb(223, 223, 223);
		--authentic-input-fg-color: rgb(0, 0, 0);

		--authentic-active-input-bg-color: rgb(255, 255, 255);
		--authentic-active-input-border-color: rgb(191, 191, 191);
		--authentic-active-input-fg-color: rgb(0, 0, 0);
	}

	.${CLASS_NAME}--dark {
		--authentic-scrollbar-color: rgb(79, 79, 79);
		--authentic-active-scrollbar-color: rgb(95, 95, 95);

		--authentic-window-bg-color: rgb(47, 47, 47);
		--authentic-window-fg-color: rgb(223, 223, 223);

		--authentic-primary-button-bg-color: var(--authentic-accent-color);
		--authentic-primary-button-border-color: transparent;
		--authentic-primary-button-fg-color: rgb(255, 255, 255);

		--authentic-active-primary-button-bg-color: var(--authentic-accent-color-bright);
		--authentic-active-primary-button-border-color: transparent;
		--authentic-active-primary-button-fg-color: rgb(255, 255, 255);

		--authentic-secondary-button-bg-color: transparent;
		--authentic-secondary-button-border-color: transparent;
		--authentic-secondary-button-fg-color: rgb(255, 255, 255);

		--authentic-active-secondary-button-bg-color: rgb(63, 63, 63);
		--authentic-active-secondary-button-border-color: transparent;
		--authentic-active-secondary-button-fg-color: rgb(255, 255, 255);

		--authentic-input-bg-color: rgb(63, 63, 63);
		--authentic-input-border-color: transparent;
		--authentic-input-fg-color: rgb(255, 255, 255);

		--authentic-active-input-bg-color: rgb(79, 79, 79);
		--authentic-active-input-border-color: transparent;
		--authentic-active-input-fg-color: rgb(255, 255, 255);
	}
`));

export type Variables = {

};

export function Variables(managers: Managers, attributes: Variables, ...children: Children) {
	let theme = managers.state.theme;
	return (
		Block("div", {
			class: [`${CLASS_NAME}`, theme.compute((theme) => `${CLASS_NAME}--${theme}`)]
		},
			...children
		)
	);
};
