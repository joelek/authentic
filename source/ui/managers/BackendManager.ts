import { State, stateify } from "@joelek/bonsai";
import * as api from "../../api/client";

export class BackendManager implements api.Client {
	protected client: api.Client;
	protected language: State<api.Language>;
	protected state: State<api.State | undefined>;
	protected user: State<api.User | undefined>;
	protected lock: Promise<any>;
	protected editable: State<boolean>;
	protected submittable: State<boolean>;

	protected waitForBackend(wait_until_utc: number): Promise<void> {
		return new Promise((resolve, reject) => {
			let ms = Math.max(0, wait_until_utc - Date.now());
			setTimeout(resolve, ms);
		});
	}

	constructor(client: api.Client, language: State<api.Language>) {
		this.client = client;
		this.language = language;
		this.state = stateify(undefined);
		this.user = stateify(undefined);
		this.lock = Promise.resolve();
		this.editable = stateify(true);
		this.submittable = stateify(true);
		this.readState({
			headers: {
				"x-preferred-language": language.value()
			}
		});
	}

	async readState(...args: Parameters<api.Client["readState"]>): ReturnType<api.Client["readState"]> {
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

	async sendCommand(...args: Parameters<api.Client["sendCommand"]>): ReturnType<api.Client["sendCommand"]> {
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

	getEditable(): State<boolean> {
		return this.editable;
	}

	getSubmittable(): State<boolean> {
		return this.submittable;
	}

	getState(): State<api.State | undefined> {
		return this.state;
	}

	getUser(): State<api.User | undefined> {
		return this.user;
	}
};
