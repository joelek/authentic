import { Attribute, Children, HTMLElementAugmentations } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
export type FormButton = HTMLElementAugmentations<HTMLButtonElement> & {
    enabled?: Attribute<boolean | undefined>;
};
export declare function FormButton(managers: Managers, { enabled: $enabled, ...augmentations }: FormButton, ...children: Children): import("@joelek/bonsai").FunctionalElement<HTMLElementEventMap, HTMLButtonElement>;
