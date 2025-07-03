import { Augmentations } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
export type FormInput = Augmentations<HTMLElementEventMap, HTMLInputElement> & {};
export declare function FormInput(managers: Managers, { ...augmentations }: FormInput): import("@joelek/bonsai").FunctionalElement<HTMLElementEventMap, HTMLInputElement>;
