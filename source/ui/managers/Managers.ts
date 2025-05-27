import * as api from "../../api";
import { BackendManager } from "./BackendManager";
import { TranslationManager } from "./TranslationManager";

export type Managers = {
	backend: BackendManager;
	translation: TranslationManager;
};

export const Managers = {
	create(client: api.Client): Managers {
		let backend = new BackendManager(client);
		let translation = new TranslationManager();
		return {
			backend,
			translation
		};
	}
}
