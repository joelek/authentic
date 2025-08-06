import { State } from "@joelek/bonsai";
import * as api from "../api/client";
import { Client } from "../client";
import { Theme } from "./managers";
export type UIOptions = {
    client?: Client;
};
export interface Controller {
    logout(): Promise<void>;
    toggle(): void;
    getUser(): State<api.User | undefined>;
    getTheme(): State<Theme>;
}
export declare function createElementAndController(options?: UIOptions): {
    element: HTMLElement;
    controller: Controller;
};
