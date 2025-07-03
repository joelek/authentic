import * as api from "../../api/client";
import { BackendManager } from "./BackendManager";
import { StateManager } from "./StateManager";
import { TranslationManager } from "./TranslationManager";

export type Managers = {
	backend: BackendManager;
	state: StateManager;
	translation: TranslationManager;
};

export const Managers = {
	create(client: api.Client): Managers {
		let backend = new BackendManager(client);
		let state = StateManager.create();
		let translation = new TranslationManager();
		return {
			backend,
			state,
			translation
		};
	}
}
