"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Managers = void 0;
const BackendManager_1 = require("./BackendManager");
const StateManager_1 = require("./StateManager");
const TranslationManager_1 = require("./TranslationManager");
exports.Managers = {
    create(client) {
        let translation = new TranslationManager_1.TranslationManager();
        let backend = new BackendManager_1.BackendManager(client, translation.getLanguage());
        let state = StateManager_1.StateManager.create();
        return {
            backend,
            state,
            translation
        };
    }
};
