import * as libcrypto from "crypto";
import * as libfs from "fs";
import * as libnet from "net";
import * as libtls from "tls";
import { Attachment, MailerOptions, STMPTLSOption } from "./config";

export const IMPLICIT_TLS_PORT = 465;
export const EXPLICIT_TLS_PORT = 587;

export type State =
	"WAITING_FOR_GREETING" |
	"WAITING_FOR_EHLO_REPLY" |
	"WAITING_FOR_STARTTLS_REPLY" |
	"WAITING_FOR_AUTH_PLAIN_REPLY" |
	"WAITING_FOR_AUTH_LOGIN_REPLY" |
	"WAITING_FOR_MAIL_REPLY" |
	"WAITING_FOR_RCPT_REPLY" |
	"WAITING_FOR_DATA_REPLY" |
	"WAITING_FOR_FINALIZATION" |
	"FINISHED";

export function encode(string: string): string {
	if (/^([\x09\x0A\x0D\x20-\x7E]*)$/.test(string)) {
		return string;
	} else {
		return `=?UTF-8?B?${Buffer.from(string).toString("base64")}?=`;
	}
};

export function split(string: string, max_length: number): Array<string> {
	let parts = [] as Array<string>;
	for (let index = 0; index < string.length; index += max_length) {
		parts.push(string.slice(index, index + max_length));
	}
	return parts;
};

export function performTLSHandshake(net_socket: libnet.Socket, servername: string, timeout_seconds: number): Promise<libtls.TLSSocket> {
	return new Promise((resolve, reject) => {
		let tls_socket = libtls.connect({
			socket: net_socket,
			servername: servername,
			rejectUnauthorized: true
		});
		let timeout = setTimeout(() => {
			tls_socket.destroy(new HandshakeTimeoutError(timeout_seconds));
		}, timeout_seconds * 1000);
		tls_socket.once("error", (error) => {
			clearTimeout(timeout);
			reject(error);
		});
		tls_socket.once("secureConnect", () => {
			clearTimeout(timeout);
			resolve(tls_socket);
		});
	});
};

export interface Mailer {
	send(options: {
		subject: string,
		message: string,
		to_address?: string,
		to_name?: string;
		from_address?: string,
		from_name?: string;
		reply_address?: string,
		reply_name?: string;
		attachments?: Array<Attachment>;
		html?: boolean;
	}): Promise<void>;
};

export class TestMailer implements Mailer {
	constructor() {}

	async send(options: {
		subject: string,
		message: string,
		to_address?: string,
		to_name?: string;
		from_address?: string,
		from_name?: string;
		reply_address?: string,
		reply_name?: string;
		attachments?: Array<Attachment>;
		html?: boolean;
	}): Promise<void> {
		console.log(options);
	}
};

export function loadConfig(config: string): MailerOptions {
	let string = libfs.readFileSync(config, "utf-8");
	let json = JSON.parse(string);
	return MailerOptions.as(json);
};

export class MissingToAddressError extends Error {
	constructor() {
		super();
	}

	get message(): string {
		return `Expected to address to be specified!`;
	}
};

export class MissingFromAddressError extends Error {
	constructor() {
		super();
	}

	get message(): string {
		return `Expected from address to be specified!`;
	}
};

export class MissingReplyAddressError extends Error {
	constructor() {
		super();
	}

	get message(): string {
		return `Expected reply address to be specified!`;
	}
};

export class ConnectionTimeoutError extends Error {
	protected timeout_seconds: number;

	constructor(timeout_seconds: number) {
		super();
		this.timeout_seconds = timeout_seconds;
	}

	get message(): string {
		return `Expected TCP connection to succeed within ${this.timeout_seconds} seconds!`;
	}
};

export class HandshakeTimeoutError extends Error {
	protected timeout_seconds: number;

	constructor(timeout_seconds: number) {
		super();
		this.timeout_seconds = timeout_seconds;
	}

	get message(): string {
		return `Expected TLS handshake to complete within ${this.timeout_seconds} seconds!`;
	}
};

export class UnexpectedResponseError extends Error {
	protected state: State;
	protected lines: Array<string>;

	constructor(state: State, lines: Array<string>) {
		super();
		this.state = state;
		this.lines = lines;
	}

	get message(): string {
		return `Expected a different response for state ${this.state}!`;
	}
};

export class UnexpectedStateError extends Error {
	protected state: State;

	constructor(state: State) {
		super();
		this.state = state;
	}

	get message(): string {
		return `Expected a different state than "${this.state}"!`;
	}
};

export class UnsupportedAuthenticationMethodError extends Error {
	protected methods: Array<string>;

	constructor(methods: Array<string>) {
		super();
		this.methods = methods;
	}

	get message(): string {
		return `Expected a supported authentication method!`;
	}
};

export type OnDataCallback = (data: Buffer) => void;

export type SendOptions = {
	subject: string,
	message: string,
	to_address?: string,
	to_name?: string;
	from_address?: string,
	from_name?: string;
	reply_address?: string,
	reply_name?: string;
	attachments?: Array<Attachment>;
	html?: boolean;
};

export class SMTPMailer implements Mailer {
	protected options: MailerOptions;

	protected generateMessageIDAddress(from_address: string): string {
		let id = libcrypto.randomBytes(16).toString("hex");
		return `${id}@${from_address.slice(from_address.indexOf("@") + 1)}`;
	}

	protected getTo(options: { to_address?: string; to_name?: string; }): { address: string; name?: string; } {
		let address = options.to_address ?? this.options.defaults?.to_address;
		let name = options.to_name ?? this.options.defaults?.to_name;
		if (address == null) {
			throw new MissingToAddressError();
		}
		return {
			address,
			name
		};
	}

	protected getFrom(options: { from_address?: string; from_name?: string; }): { address: string; name?: string; } {
		let address = options.from_address ?? this.options.defaults?.from_address;
		let name = options.from_name ?? this.options.defaults?.from_name;
		if (address == null) {
			throw new MissingFromAddressError();
		}
		return {
			address,
			name
		};
	}

	protected getReply(options: { reply_address?: string; reply_name?: string; }): { address: string; name?: string; } {
		let address = options.reply_address ?? this.options.defaults?.reply_address;
		let name = options.reply_name ?? this.options.defaults?.reply_name;
		if (address == null) {
			throw new MissingReplyAddressError();
		}
		return {
			address,
			name
		};
	}

	protected getTlsOption(): STMPTLSOption {
		let smtp = this.options.smtp;
		if (smtp.tls != null) {
			return smtp.tls;
		}
		if (smtp.port === EXPLICIT_TLS_PORT) {
			return "EXPLICIT";
		}
		if (smtp.port === IMPLICIT_TLS_PORT) {
			return "IMPLICIT";
		}
		return "IMPLICIT";
	}

	protected getLoginMethods(lines: Array<string>): Array<string> {
		let methods = new Array<string>();
		for (let line of lines) {
			if (line.startsWith("250-AUTH ")) {
				methods.push(...line.slice("250-AUTH ".length).split(" "));
			}
		}
		return methods;
	}

	protected finishSending(options: SendOptions, tls_socket: libtls.TLSSocket, state: State): Promise<void> {
		let to = this.getTo(options);
		let from = this.getFrom(options);
		let reply = this.getReply(options);
		let attachments = options.attachments ?? [];
		return new Promise((resolve, reject) => {
			let ondata: OnDataCallback = (buffer) => {
				try {
					let lines = buffer.toString("ascii").split("\r\n");
					console.log(state, lines);
					if (state === "WAITING_FOR_EHLO_REPLY") {
						if (lines[0].startsWith("250")) {
							let methods = this.getLoginMethods(lines);
							if (methods.includes("PLAIN")) {
								tls_socket.write(`AUTH PLAIN ${Buffer.from("\0" + this.options.smtp.username + "\0" + this.options.smtp.password).toString("base64")}\r\n`);
								state = "WAITING_FOR_AUTH_PLAIN_REPLY";
							} else if (methods.includes("LOGIN")) {
								tls_socket.write(`AUTH LOGIN\r\n`);
								state = "WAITING_FOR_AUTH_LOGIN_REPLY";
							} else {
								throw new UnsupportedAuthenticationMethodError(methods);
							}
						} else {
							throw new UnexpectedResponseError(state, lines);
						}
					} else if (state === "WAITING_FOR_AUTH_PLAIN_REPLY") {
						if (lines[0].startsWith("235")) {
							tls_socket.write(`MAIL FROM: <${from.address}>\r\n`);
							state = "WAITING_FOR_MAIL_REPLY";
						} else {
							throw new UnexpectedResponseError(state, lines);
						}
					} else if (state === "WAITING_FOR_AUTH_LOGIN_REPLY") {
						if (lines[0].startsWith("334")) {
							if (lines[0] === `334 ${Buffer.from("Username:").toString("base64")}`) {
								tls_socket.write(`${Buffer.from(this.options.smtp.username).toString("base64")}\r\n`);
								state = "WAITING_FOR_AUTH_LOGIN_REPLY";
							} else if (lines[0] === `334 ${Buffer.from("Password:").toString("base64")}`) {
								tls_socket.write(`${Buffer.from(this.options.smtp.password).toString("base64")}\r\n`);
								state = "WAITING_FOR_AUTH_LOGIN_REPLY";
							} else {
								throw new UnexpectedResponseError(state, lines);
							}
						} else if (lines[0].startsWith("235")) {
							tls_socket.write(`MAIL FROM: <${from.address}>\r\n`);
							state = "WAITING_FOR_MAIL_REPLY";
						} else {
							throw new UnexpectedResponseError(state, lines);
						}
					} else if (state === "WAITING_FOR_MAIL_REPLY") {
						if (lines[0].startsWith("250")) {
							tls_socket.write(`RCPT TO: <${to.address}>\r\n`);
							state = "WAITING_FOR_RCPT_REPLY";
						} else {
							throw new UnexpectedResponseError(state, lines);
						}
					} else if (state === "WAITING_FOR_RCPT_REPLY") {
						if (lines[0].startsWith("250")) {
							tls_socket.write(`DATA\r\n`);
							state = "WAITING_FOR_DATA_REPLY";
						} else {
							throw new UnexpectedResponseError(state, lines);
						}
					} else if (state === "WAITING_FOR_DATA_REPLY") {
						if (lines[0].startsWith("354")) {
							let boundary = libcrypto.randomBytes(16).toString("hex");
							let lines = [
								`MIME-Version: 1.0`,
								`Date: ${new Date().toUTCString()}`,
								`Message-ID: <${this.generateMessageIDAddress(from.address)}>`
							];
							if (typeof from.name !== "undefined") {
								lines.push(`From: ${encode(from.name)} <${from.address}>`);
							} else {
								lines.push(`From: <${from.address}>`);
							}
							if (typeof to.name !== "undefined") {
								lines.push(`To: ${encode(to.name)} <${to.address}>`);
							} else {
								lines.push(`To: <${to.address}>`);
							}
							if (typeof reply.name !== "undefined") {
								lines.push(`Reply-To: ${encode(reply.name)} <${reply.address}>`);
							} else {
								lines.push(`Reply-To: <${reply.address}>`);
							}
							lines.push(`Subject: ${encode(options.subject)}`);
							lines.push(`Content-Type: multipart/mixed; boundary=${boundary}`);
							lines.push(``);
							lines.push(`--${boundary}`);
							lines.push(`Content-Type: ${options.html === true ? "text/html" : "text/plain"}; charset=utf-8`);
							lines.push(`Content-Transfer-Encoding: base64`);
							lines.push(``);
							lines.push(...split(Buffer.from(options.message).toString("base64"), 76));
							for (let attachment of attachments) {
								lines.push(``);
								lines.push(`--${boundary}`);
								lines.push(`Content-Type: ${attachment.mime}; name=${attachment.filename}`);
								lines.push(`Content-Transfer-Encoding: base64`);
								lines.push(`Content-Disposition: attachment; filename=${attachment.filename}`);
								lines.push(``);
								lines.push(...split(Buffer.from(attachment.data).toString("base64"), 76));
							}
							lines.push(``);
							lines.push(`--${boundary}--`);
							lines.push(`.`);
							for (let line of lines) {
								tls_socket.write(`${line}\r\n`);
							}
							state = "WAITING_FOR_FINALIZATION";
						} else {
							throw new UnexpectedResponseError(state, lines);
						}
					} else if (state === "WAITING_FOR_FINALIZATION") {
						if (lines[0].startsWith("250")) {
							state = "FINISHED";
							tls_socket.off("data", ondata);
							tls_socket.write("QUIT\r\n");
							resolve();
						} else {
							throw new UnexpectedResponseError(state, lines);
						}
					} else {
						throw new UnexpectedStateError(state);
					}
				} catch (error) {
					tls_socket.off("data", ondata);
					tls_socket.write("QUIT\r\n");
					tls_socket.destroy();
					// NOTE: Handles ondata errors.
					reject(error);
				}
			};
			tls_socket.on("data", ondata);
		});
	}

	protected sendExplicit(options: SendOptions): Promise<void> {
		let timeout_seconds = this.options.smtp.timeout_seconds ?? 10;
		let state: State = "WAITING_FOR_GREETING";
		return new Promise((resolve, reject) => {
			let net_socket = libnet.connect({
				host: this.options.smtp.hostname,
				port: this.options.smtp.port
			});
			let timeout = setTimeout(() => {
				net_socket.destroy(new ConnectionTimeoutError(timeout_seconds));
			}, timeout_seconds * 1000);
			net_socket.once("error", (error) => {
				clearTimeout(timeout);
				// NOTE: Handles host not being reachable as well as host being reachable but port being closed.
				reject(error);
			});
			net_socket.once("connect", () => {
				clearTimeout(timeout);
				let ondata: OnDataCallback = (buffer) => {
					try {
						let lines = buffer.toString("ascii").split("\r\n");
						console.log(state, lines);
						if (state === "WAITING_FOR_GREETING") {
							if (lines[0].startsWith("220")) {
								net_socket.write(`EHLO mail.example.com\r\n`);
								state = "WAITING_FOR_EHLO_REPLY";
							} else {
								throw new UnexpectedResponseError(state, lines);
							}
						} else if (state === "WAITING_FOR_EHLO_REPLY") {
							if (lines[0].startsWith("250")) {
								net_socket.write(`STARTTLS\r\n`);
								state = "WAITING_FOR_STARTTLS_REPLY";
							} else {
								throw new UnexpectedResponseError(state, lines);
							}
						} else if (state === "WAITING_FOR_STARTTLS_REPLY") {
							if (lines[0].startsWith("220")) {
								net_socket.off("data", ondata);
								performTLSHandshake(net_socket, this.options.smtp.hostname, timeout_seconds)
									.then((tls_socket) => {
										tls_socket.write(`EHLO mail.example.com\r\n`);
										state = "WAITING_FOR_EHLO_REPLY";
										resolve(this.finishSending(options, tls_socket, state));
									})
									.catch((error) => {
										// NOTE: Handles TLS handshake not completing successfully.
										reject(error);
									});
							} else {
								throw new UnexpectedResponseError(state, lines);
							}
						} else {
							throw new UnexpectedStateError(state);
						}
					} catch (error) {
						net_socket.off("data", ondata);
						net_socket.write("QUIT\r\n");
						net_socket.destroy();
						// NOTE: Handles ondata errors.
						reject(error);
					}
				};
				net_socket.on("data", ondata);
			});
		});
	}

	protected sendImplicit(options: SendOptions): Promise<void> {
		let timeout_seconds = this.options.smtp.timeout_seconds ?? 10;
		let state: State = "WAITING_FOR_GREETING";
		return new Promise((resolve, reject) => {
			let net_socket = libnet.connect({
				host: this.options.smtp.hostname,
				port: this.options.smtp.port
			});
			let timeout = setTimeout(() => {
				net_socket.destroy(new ConnectionTimeoutError(timeout_seconds));
			}, timeout_seconds * 1000);
			net_socket.once("error", (error) => {
				clearTimeout(timeout);
				// NOTE: Handles host not being reachable as well as host being reachable but port being closed.
				reject(error);
			});
			net_socket.once("connect", async () => {
				clearTimeout(timeout);
				performTLSHandshake(net_socket, this.options.smtp.hostname, timeout_seconds)
					.then((tls_socket) => {
						let ondata: OnDataCallback = (buffer) => {
							try {
								let lines = buffer.toString("ascii").split("\r\n");
								console.log(state, lines);
								if (state === "WAITING_FOR_GREETING") {
									if (lines[0].startsWith("220")) {
										tls_socket.off("data", ondata);
										tls_socket.write(`EHLO mail.example.com\r\n`);
										state = "WAITING_FOR_EHLO_REPLY";
										resolve(this.finishSending(options, tls_socket, state));
									} else {
										throw new UnexpectedResponseError(state, lines);
									}
								} else {
									throw new UnexpectedStateError(state);
								}
							} catch (error) {
								tls_socket.off("data", ondata);
								tls_socket.write("QUIT\r\n");
								tls_socket.destroy();
								// NOTE: Handles ondata errors.
								reject(error);
							}
						};
						tls_socket.on("data", ondata);
					})
					.catch((error) => {
						// NOTE: Handles TLS handshake not completing successfully.
						reject(error);
					});
			});
		});
	}

	constructor(options: MailerOptions) {
		this.options = {
			...options,
			smtp: {
				...options.smtp
			},
			defaults: {
				...options.defaults
			}
		};
	}

	send(options: SendOptions): Promise<void> {
		let tls = this.getTlsOption();
		if (tls === "IMPLICIT") {
			return this.sendImplicit(options);
		} else {
			return this.sendExplicit(options);
		}
	};
};
