import { Augmentations, Children, FunctionalElementEventMap } from "@joelek/bonsai";
export type BlockEvents<A> = FunctionalElementEventMap<A> & {};
export type Block = {};
export declare function Block<A extends BlockEvents<A>, B extends Element>(attributes: Augmentations<A, B>, ...children: Children): import("@joelek/bonsai").FunctionalElement<HTMLElementEventMap, HTMLDivElement>;
