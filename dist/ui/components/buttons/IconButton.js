"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconButton = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
const Icon_1 = require("../Icon");
const CLASS_NAME = "authentic-icon-button";
document.head.appendChild(bonsai_1.html.style({}, `
	.${CLASS_NAME} {
		background-color: transparent;
		color: rgb(255, 255, 255);
		cursor: pointer;
		padding: 6px;
	}

	.${CLASS_NAME}:hover {
		background-color: rgb(95, 95, 95);
	}

	.${CLASS_NAME}[disabled] {
		background-color: transparent;
		color: rgb(127, 127, 127);
		cursor: not-allowed;
	}
`));
function IconButton(managers, { graphic: $graphic, ...augmentations }) {
    let graphic = $graphic;
    return ((0, Block_1.Block)("button", {
        ...augmentations,
        class: [`${CLASS_NAME}`, ...(augmentations.class ?? [])]
    }, (0, Icon_1.Icon)(managers, {
        graphic: graphic,
        size: "20px"
    })));
}
exports.IconButton = IconButton;
;
