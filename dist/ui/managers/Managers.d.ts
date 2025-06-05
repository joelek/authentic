import * as api from "../../api/client";
import { BackendManager } from "./BackendManager";
import { TranslationManager } from "./TranslationManager";
export type Managers = {
    backend: BackendManager;
    translation: TranslationManager;
};
export declare const Managers: {
    create(client: api.Client): Managers;
};
