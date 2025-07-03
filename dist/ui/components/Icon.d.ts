import { Attribute, Augmentations } from "@joelek/bonsai";
import { Managers } from "../managers/Managers";
type Data = [string, [string, string][], Data[]];
declare const ICON_DATA: Record<"cross" | "none", Data>;
type Graphic = keyof typeof ICON_DATA;
export type Icon = Augmentations<HTMLElementEventMap, HTMLDivElement> & {
    graphic: Attribute<Graphic>;
    size: Attribute<string>;
};
export declare function Icon(managers: Managers, { graphic: $graphic, size: $size, ...augmentations }: Icon): import("@joelek/bonsai").FunctionalElement<HTMLElementEventMap, HTMLDivElement>;
export {};
