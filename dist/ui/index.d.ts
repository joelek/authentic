import { Client } from "../client";
export type UIOptions = {
    client?: Client;
};
export interface InterfaceManager {
    toggle(): void;
}
export declare function injectUserInterface(options?: UIOptions): InterfaceManager;
