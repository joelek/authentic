import { State, stateify } from "@joelek/bonsai";
import * as api from "../../api";

export class BackendManager implements api.Client {
	protected client: api.Client;
	protected state: State<api.State>;
	protected wait_until_utc: number;

	protected wait(): Promise<void> {
		let ms = Math.max(0, this.wait_until_utc - Date.now());
		return new Promise((resolve, reject) => {
			setTimeout(resolve, ms);
		});
	}

	constructor(client: api.Client) {
		this.client = client;
		this.state = stateify({
			type: "UNKNOWN_STATE",
			reason: "STATE_NOT_READ"
		});
		this.wait_until_utc = Date.now();
		this.readState({}).catch(() => undefined).then(async (response) => {
			if (response != null) {
				let payload = await response.payload();
				this.state.update(payload.state);
			}
		});
	}

	async readState(...args: Parameters<api.Client["readState"]>): ReturnType<api.Client["readState"]> {
		await this.wait();
		let response = await this.client.readState(...args);
		this.wait_until_utc = Date.now() + response.headers()["retry-after"] * 1000;
		return response;
	}

	async sendCommand(...args: Parameters<api.Client["sendCommand"]>): ReturnType<api.Client["sendCommand"]> {
		await this.wait();
		let response = await this.client.sendCommand(...args);
		this.wait_until_utc = Date.now() + response.headers()["retry-after"] * 1000;
		return response;
	}

	getState(): State<api.State> {
		return this.state.shadow();
	}
};
