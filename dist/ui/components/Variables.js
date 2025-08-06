"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variables = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("./Block");
const CLASS_NAME = "authentic-variables";
document.head.appendChild(bonsai_1.html.style({}, `
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
		--authentic-button-fg-color: rgb(255, 255, 255);
		--authentic-button-bg-color: var(--authentic-accent-color);
		--authentic-button-border-color: transparent;
		--authentic-active-button-bg-color: var(--authentic-accent-color-bright);
		--authentic-active-button-border-color: transparent;
		--authentic-disabled-button-bg-color: rgb(127, 127, 127);
		--authentic-disabled-button-border-color: transparent;
		--authentic-input-fg-color: rgb(0, 0, 0);
		--authentic-input-bg-color: rgb(255, 255, 255);
		--authentic-input-border-color: rgb(223, 223, 223);
		--authentic-active-input-bg-color: rgb(255, 255, 255);
		--authentic-active-input-border-color: rgb(191, 191, 191);
		--authentic-disabled-input-bg-color: rgb(255, 255, 255);
		--authentic-disabled-input-border-color: rgb(191, 191, 191);
	}

	.${CLASS_NAME}--dark {
		--authentic-scrollbar-color: rgb(79, 79, 79);
		--authentic-active-scrollbar-color: rgb(95, 95, 95);
		--authentic-window-bg-color: rgb(47, 47, 47);
		--authentic-window-fg-color: rgb(191, 191, 191);
		--authentic-button-fg-color: rgb(255, 255, 255);
		--authentic-button-bg-color: var(--authentic-accent-color);
		--authentic-button-border-color: transparent;
		--authentic-active-button-bg-color: var(--authentic-accent-color-bright);
		--authentic-active-button-border-color: transparent;
		--authentic-disabled-button-bg-color: rgb(63, 63, 63);
		--authentic-disabled-button-border-color: transparent;
		--authentic-input-fg-color: rgb(255, 255, 255);
		--authentic-input-bg-color: rgb(63, 63, 63);
		--authentic-input-border-color: transparent;
		--authentic-active-input-bg-color: rgb(79, 79, 79);
		--authentic-active-input-border-color: transparent;
		--authentic-disabled-input-bg-color: rgb(79, 79, 79);
		--authentic-disabled-input-border-color: transparent;
	}
`));
function Variables(managers, attributes, ...children) {
    let theme = managers.state.theme;
    return ((0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}`, theme.compute((theme) => `${CLASS_NAME}--${theme}`)]
    }, ...children));
}
exports.Variables = Variables;
;
