import { State, stateify } from "@joelek/bonsai";
import * as api from "../../api/client";

export class BackendManager implements api.Client {
	protected client: api.Client;
	protected state: State<api.State | undefined>;
	protected wait_until_utc: number;
	protected pending: State<boolean>;

	protected waitForPending(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.pending.value()) {
				resolve();
			} else {
				let subscription = this.pending.observe("update", () => {
					if (!this.pending.value()) {
						subscription();
						resolve();
					}
				});
			}
		});
	}

	protected waitForBackend(): Promise<void> {
		return new Promise((resolve, reject) => {
			let ms = Math.max(0, this.wait_until_utc - Date.now());
			setTimeout(resolve, ms);
		});
	}

	protected async wait(): Promise<void> {
		await this.waitForPending();
		await this.waitForBackend();
	}

	constructor(client: api.Client) {
		this.client = client;
		this.state = stateify(undefined);
		this.wait_until_utc = Date.now();
		this.pending = stateify(false);
		this.readState({}).catch(() => undefined).then(async (response) => {
			if (response != null) {
				let payload = await response.payload();
				this.state.update(payload.state);
			}
		});
	}

	async readState(...args: Parameters<api.Client["readState"]>): ReturnType<api.Client["readState"]> {
		await this.wait();
		this.pending.update(true);
		try {
			let response = await this.client.readState(...args);
			this.wait_until_utc = Date.now() + response.headers()["x-wait-ms"];
			let payload = await response.payload();
			this.state.update(payload.state);
			return response;
		} finally {
			this.pending.update(false);
		}
	}

	async sendCommand(...args: Parameters<api.Client["sendCommand"]>): ReturnType<api.Client["sendCommand"]> {
		await this.wait();
		this.pending.update(true);
		try {
			let response = await this.client.sendCommand(...args);
			this.wait_until_utc = Date.now() + response.headers()["x-wait-ms"];
			let payload = await response.payload();
			this.state.update(payload.state);
			return response;
		} finally {
			this.pending.update(false);
		}
	}

	getPending(): State<boolean> {
		return this.pending;
	}

	getState(): State<api.State | undefined> {
		return this.state;
	}
};
