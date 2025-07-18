"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendManager = void 0;
const bonsai_1 = require("@joelek/bonsai");
class BackendManager {
    client;
    language;
    state;
    user;
    lock;
    editable;
    submittable;
    waitForBackend(wait_until_utc) {
        return new Promise((resolve, reject) => {
            let ms = Math.max(0, wait_until_utc - Date.now());
            setTimeout(resolve, ms);
        });
    }
    constructor(client, language) {
        this.client = client;
        this.language = language;
        this.state = (0, bonsai_1.stateify)(undefined);
        this.user = (0, bonsai_1.stateify)(undefined);
        this.lock = Promise.resolve();
        this.editable = (0, bonsai_1.stateify)(true);
        this.submittable = (0, bonsai_1.stateify)(true);
        this.readState({
            headers: {
                "x-preferred-language": language.value()
            }
        });
    }
    async readState(...args) {
        this.editable.update(false);
        this.submittable.update(false);
        await this.lock;
        let response = this.client.readState(...args);
        this.lock = this.lock
            .then(() => response)
            .then((response) => {
            let wait_until_utc = Date.now() + response.headers()["x-wait-ms"];
            return this.waitForBackend(wait_until_utc);
        })
            .catch(() => undefined)
            .finally(() => {
            this.submittable.update(true);
        });
        response = response
            .then(async (response) => {
            let payload = await response.payload();
            this.state.update(payload.state);
            this.user.update(payload.user);
            return response;
        })
            .finally(() => {
            this.editable.update(true);
        });
        return response;
    }
    async sendCommand(...args) {
        this.editable.update(false);
        this.submittable.update(false);
        await this.lock;
        let response = this.client.sendCommand(...args);
        this.lock = this.lock
            .then(() => response)
            .then((response) => {
            let wait_until_utc = Date.now() + response.headers()["x-wait-ms"];
            return this.waitForBackend(wait_until_utc);
        })
            .catch(() => undefined)
            .finally(() => {
            this.submittable.update(true);
        });
        response = response
            .then(async (response) => {
            let payload = await response.payload();
            this.state.update(payload.state);
            this.user.update(payload.user);
            return response;
        })
            .finally(() => {
            this.editable.update(true);
        });
        return response;
    }
    getEditable() {
        return this.editable;
    }
    getSubmittable() {
        return this.submittable;
    }
    getState() {
        return this.state;
    }
    getUser() {
        return this.user;
    }
}
exports.BackendManager = BackendManager;
;
