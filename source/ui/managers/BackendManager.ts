import { State, stateify } from "@joelek/bonsai";
import * as api from "../../api";

export class BackendManager implements api.Client {
	protected client: api.Client;
	protected state: State<api.State>;

	constructor(client: api.Client) {
		this.client = client;
		this.state = stateify({
			type: "UNKNOWN_STATE",
			reason: "STATE_NOT_READ"
		});
		this.readState({}).catch(() => undefined).then(async (response) => {
			if (response != null) {
				let payload = await response.payload();
				this.state.update(payload.state);
			}
		});
	}

	async readState(...args: Parameters<api.Client["readState"]>): ReturnType<api.Client["readState"]> {
		return this.client.readState(...args);
	}

	async sendCommand(...args: Parameters<api.Client["sendCommand"]>): ReturnType<api.Client["sendCommand"]> {
		return this.client.sendCommand(...args);
	}

	getState(): State<api.State> {
		return this.state.shadow();
	}
};
