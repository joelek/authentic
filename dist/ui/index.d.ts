import { Client } from "../client";
export type Options = {
    client?: Client;
};
export interface Interface {
    toggle(): void;
}
export declare function injectUserInterface(options?: Options): Interface;
