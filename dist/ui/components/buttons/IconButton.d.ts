import { HTMLElementAugmentations } from "@joelek/bonsai";
import { Managers } from "../../managers/Managers";
import { Icon } from "../Icon";
export type IconButton = HTMLElementAugmentations<HTMLButtonElement> & {
    graphic: Icon["graphic"];
};
export declare function IconButton(managers: Managers, { graphic: $graphic, ...augmentations }: IconButton): import("@joelek/bonsai").FunctionalElement<HTMLElementEventMap, HTMLButtonElement>;
