import { Augmentations, Children } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
export type FormGroup = Augmentations<HTMLElementEventMap, HTMLFormElement> & {};
export declare function FormGroup(managers: Managers, { ...augmentations }: FormGroup, ...children: Children): import("@joelek/bonsai").FunctionalElement<HTMLElementEventMap, HTMLFormElement>;
