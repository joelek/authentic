import { Attribute, computed, html, HTMLElementAugmentations, stateify } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Block } from "../Block";
import { Icon } from "../Icon";
import { SelectTitle } from "../titles/SelectTitle";

const CLASS_NAME = "authentic-form-select";

document.head.appendChild(html.style({}, `
	.${CLASS_NAME} {
		border-radius: 6px;
		border-style: solid;
		border-width: 1px;
		height: auto;
		transition: background-color 0.125s, border-color 0.125s, color 0.125s, opacity 0.125s;
	}

	.${CLASS_NAME} {
		background-color: var(--authentic-input-bg-color);
		border-color: var(--authentic-input-border-color);
		color: var(--authentic-input-fg-color);
	}

	.${CLASS_NAME}[disabled] {
		opacity: 0.5;
	}

	.${CLASS_NAME}:hover,
	.${CLASS_NAME}:focus {
		background-color: var(--authentic-active-input-bg-color);
		border-color: var(--authentic-active-input-border-color);
		color: var(--authentic-active-input-fg-color);
	}

	.${CLASS_NAME}__box {
		align-items: center;
		display: grid;
		gap: 6px;
		grid-template-columns: minmax(0%, 100%) auto;
		padding: 5px;
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

type FormSelectOption<A extends string> = {
	title: string;
	option: A;
};

type FormSelectGroup<A extends string> = {
	title: string;
	options: Array<FormSelectOption<A>>;
};

export type FormSelect<A extends string> = HTMLElementAugmentations<HTMLDivElement> & {
	enabled?: Attribute<boolean>;
	groups: Attribute<Array<FormSelectGroup<A>>>;
	value: Attribute<A>;
};

export function FormSelect<A extends string>(managers: Managers, { enabled: $enabled, groups: $groups, value: $value, ...augmentations }: FormSelect<A>) {
	let enabled = stateify($enabled);
	// Cast generic type A to string to avoid typing issues.
	let groups = stateify($groups as Attribute<Array<FormSelectGroup<string>>>);
	let value = stateify($value as Attribute<string>);
	let title = computed([groups, value], (groups, value) => {
		for (let group of groups) {
			for (let option of group.options) {
				if (option.option === value) {
					return option.title;
				}
			}
		}
	});
	return (
		Block("div", {
			class: [`${CLASS_NAME}`],
			disabled: enabled.compute((enabled) => enabled !== false ? undefined : ""),
		},
			Block("div", {
				class: [`${CLASS_NAME}__box`]
			},
				SelectTitle(managers, {
					class: [`${CLASS_NAME}__box-title`]
				},
					title
				),
				Icon(managers, {
					class: [`${CLASS_NAME}__box-icon`],
					graphic: "chevron-down",
					size: "16px",
					style: {
						padding: "2px"
					}
				})
			),
			Block("select", {
				class: [`${CLASS_NAME}__select`],
				disabled: enabled.compute((enabled) => enabled !== false ? undefined : ""),
				value: value
			},
				groups.mapStates((group, groupIndex) => (
					Block("optgroup", {
						label: group.title
					},
						group.options.mapStates((option, optionIndex) => (
							Block("option", {
								value: option.option,
								selected: computed([value, option.option], (value, option) => value === option ? "" : undefined),
							},
								option.title
							)
						))
					)
				))
			)
		).augment(augmentations)
	);
};
