"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormSelect = void 0;
const bonsai_1 = require("@joelek/bonsai");
const Block_1 = require("../Block");
const Icon_1 = require("../Icon");
const SelectTitle_1 = require("../titles/SelectTitle");
const CLASS_NAME = "authentic-form-select";
document.head.appendChild(bonsai_1.html.style({}, `
	.${CLASS_NAME} {
		background-color: rgb(63, 63, 63);
		border-radius: 4px;
		transition: all 0.125s;
	}

	.${CLASS_NAME}:hover {
		background-color: rgb(79, 79, 79);
	}

	.${CLASS_NAME}__box {
		align-items: center;
		display: grid;
		gap: 6px;
		grid-template-columns: minmax(0%, 100%) auto;
		padding: 6px;
	}

	.${CLASS_NAME}__box-title {

	}

	.${CLASS_NAME}__box-icon {
		color: rgb(255, 255, 255);
	}

	.${CLASS_NAME}__select {
		cursor: pointer;
		opacity: 0.0;
		position: absolute;
			top: 0%;
			left: 0%;
	}

	.${CLASS_NAME}__select[disabled] {
		cursor: not-allowed;
	}
`));
function FormSelect(managers, { enabled: $enabled, groups: $groups, value: $value, ...augmentations }) {
    let enabled = (0, bonsai_1.stateify)($enabled);
    // Cast generic type A to string to avoid typing issues.
    let groups = (0, bonsai_1.stateify)($groups);
    let value = (0, bonsai_1.stateify)($value);
    let title = (0, bonsai_1.computed)([groups, value], (groups, value) => {
        for (let group of groups) {
            for (let option of group.options) {
                if (option.option === value) {
                    return option.title;
                }
            }
        }
    });
    return ((0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}`]
    }, (0, Block_1.Block)("div", {
        class: [`${CLASS_NAME}__box`]
    }, (0, SelectTitle_1.SelectTitle)(managers, {
        class: [`${CLASS_NAME}__box-title`]
    }, title), (0, Icon_1.Icon)(managers, {
        class: [`${CLASS_NAME}__box-icon`],
        graphic: "chevron-down",
        size: "20px"
    })), (0, Block_1.Block)("select", {
        class: [`${CLASS_NAME}__select`],
        disabled: enabled.compute((enabled) => enabled !== false ? undefined : ""),
        value: value
    }, groups.mapStates((group, groupIndex) => ((0, Block_1.Block)("optgroup", {
        label: group.title
    }, group.options.mapStates((option, optionIndex) => ((0, Block_1.Block)("option", {
        value: option.option,
        selected: (0, bonsai_1.computed)([value, option.option], (value, option) => value === option ? "" : undefined),
    }, option.title)))))))).augment(augmentations));
}
exports.FormSelect = FormSelect;
;
