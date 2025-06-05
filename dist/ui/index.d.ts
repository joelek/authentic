import { Client } from "../client";
export type UIOptions = {
    client?: Client;
};
export interface Interface {
    toggle(): void;
}
export declare function injectUserInterface(options?: UIOptions): Interface;
