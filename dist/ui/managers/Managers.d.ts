import * as api from "../../api/client";
import { BackendManager } from "./BackendManager";
import { StateManager } from "./StateManager";
import { TranslationManager } from "./TranslationManager";
export type Managers = {
    backend: BackendManager;
    state: StateManager;
    translation: TranslationManager;
};
export declare const Managers: {
    create(client: api.Client): Managers;
};
