"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Managers = void 0;
const BackendManager_1 = require("./BackendManager");
const TranslationManager_1 = require("./TranslationManager");
exports.Managers = {
    create(client) {
        let backend = new BackendManager_1.BackendManager(client);
        let translation = new TranslationManager_1.TranslationManager();
        return {
            backend,
            translation
        };
    }
};
