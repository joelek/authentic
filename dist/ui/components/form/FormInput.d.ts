import { Attribute, HTMLElementAugmentations } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
export type FormInput = HTMLElementAugmentations<HTMLInputElement> & {
    enabled?: Attribute<boolean | undefined>;
};
export declare function FormInput(managers: Managers, { enabled: $enabled, ...augmentations }: FormInput): import("@joelek/bonsai").FunctionalElement<HTMLElementEventMap, HTMLInputElement>;
