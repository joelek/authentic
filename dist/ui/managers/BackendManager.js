"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendManager = void 0;
const bonsai_1 = require("@joelek/bonsai");
class BackendManager {
    client;
    state;
    wait_until_utc;
    pending;
    waitForPending() {
        return new Promise((resolve, reject) => {
            if (!this.pending.value()) {
                resolve();
            }
            else {
                let subscription = this.pending.observe("update", () => {
                    if (!this.pending.value()) {
                        subscription();
                        resolve();
                    }
                });
            }
        });
    }
    waitForBackend() {
        return new Promise((resolve, reject) => {
            let ms = Math.max(0, this.wait_until_utc - Date.now());
            setTimeout(resolve, ms);
        });
    }
    async wait() {
        await this.waitForPending();
        await this.waitForBackend();
    }
    constructor(client) {
        this.client = client;
        this.state = (0, bonsai_1.stateify)(undefined);
        this.wait_until_utc = Date.now();
        this.pending = (0, bonsai_1.stateify)(false);
        this.readState({}).catch(() => undefined).then(async (response) => {
            if (response != null) {
                let payload = await response.payload();
                this.state.update(payload.state);
            }
        });
    }
    async readState(...args) {
        await this.wait();
        this.pending.update(true);
        try {
            let response = await this.client.readState(...args);
            this.wait_until_utc = Date.now() + response.headers()["x-wait-ms"];
            let payload = await response.payload();
            this.state.update(payload.state);
            return response;
        }
        finally {
            this.pending.update(false);
        }
    }
    async sendCommand(...args) {
        await this.wait();
        this.pending.update(true);
        try {
            let response = await this.client.sendCommand(...args);
            this.wait_until_utc = Date.now() + response.headers()["x-wait-ms"];
            let payload = await response.payload();
            this.state.update(payload.state);
            return response;
        }
        finally {
            this.pending.update(false);
        }
    }
    getPending() {
        return this.pending;
    }
    getState() {
        return this.state;
    }
}
exports.BackendManager = BackendManager;
;
