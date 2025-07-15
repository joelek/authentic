import { Attribute, Augmentations } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
type FormSelectOption<A extends string> = {
    title: string;
    option: A;
};
type FormSelectGroup<A extends string> = {
    title: string;
    options: Array<FormSelectOption<A>>;
};
export type FormSelect<A extends string> = Augmentations<HTMLElementEventMap, HTMLDivElement> & {
    enabled?: Attribute<boolean>;
    groups: Attribute<Array<FormSelectGroup<A>>>;
    value: Attribute<A>;
};
export declare function FormSelect<A extends string>(managers: Managers, { enabled: $enabled, groups: $groups, value: $value, ...augmentations }: FormSelect<A>): import("@joelek/bonsai").FunctionalElement<HTMLElementEventMap, HTMLDivElement>;
export {};
