import { Children, HTMLElementAugmentations } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
export type FormGroup = HTMLElementAugmentations<HTMLFormElement> & {};
export declare function FormGroup(managers: Managers, { ...augmentations }: FormGroup, ...children: Children): import("@joelek/bonsai").FunctionalElement<HTMLElementEventMap, HTMLFormElement>;
