import { Augmentations, Children } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
export type FormButton = Augmentations<HTMLElementEventMap, HTMLButtonElement> & {};
export declare function FormButton(managers: Managers, { ...augmentations }: FormButton, ...children: Children): import("@joelek/bonsai").FunctionalElement<HTMLElementEventMap, HTMLButtonElement>;
