import { Augmentations, Children } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
export type FormGroup = Augmentations<HTMLElementEventMap, HTMLDivElement> & {};
export declare function FormGroup(managers: Managers, attributes: FormGroup, ...children: Children): import("@joelek/bonsai").FunctionalElement<HTMLElementEventMap, HTMLDivElement>;
