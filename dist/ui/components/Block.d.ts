import { Children, HTMLElementAugmentations } from "@joelek/bonsai";
export type Block<A extends keyof HTMLElementTagNameMap> = HTMLElementAugmentations<HTMLElementTagNameMap[A]>;
export declare function Block<A extends keyof HTMLElementTagNameMap>(type: A, { ...augmentations }: Block<A>, ...children: Children): import("@joelek/bonsai").FunctionalElement<HTMLElementEventMap, HTMLElementTagNameMap[A]>;
