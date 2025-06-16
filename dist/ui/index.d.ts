import { State } from "@joelek/bonsai";
import * as api from "../api/client";
import { Client } from "../client";
export type UIOptions = {
    client?: Client;
};
export interface InterfaceManager {
    logout(): Promise<void>;
    toggle(): void;
    getUser(): State<api.User | undefined>;
}
export declare function injectUserInterface(options?: UIOptions): InterfaceManager;
