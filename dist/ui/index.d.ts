import { State } from "@joelek/bonsai";
import * as api from "../api/client";
import { Client } from "../client";
export type UIOptions = {
    client?: Client;
};
export interface Controller {
    logout(): Promise<void>;
    toggle(): void;
    getUser(): State<api.User | undefined>;
}
export declare function createElementAndController(options?: UIOptions): {
    element: HTMLElement;
    controller: Controller;
};
