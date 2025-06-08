import { Augmentations, Children } from "@joelek/bonsai";
export type Block<A extends keyof HTMLElementTagNameMap> = Augmentations<HTMLElementEventMap, HTMLElementTagNameMap[A]>;
export declare function Block<A extends keyof HTMLElementTagNameMap>(type: A, attributes: Block<A>, ...children: Children): import("@joelek/bonsai").FunctionalElement<HTMLElementEventMap, HTMLElementTagNameMap[A]>;
