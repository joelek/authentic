import { State } from "@joelek/bonsai";
import { Managers } from "../managers/Managers";
export type Modal = {
    visible: State<boolean>;
};
export declare function Modal(managers: Managers, attributes: Modal): import("@joelek/bonsai").FunctionalElement<HTMLElementEventMap, HTMLDivElement>;
