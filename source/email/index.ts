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
	"WAITING_FOR_AUTH_REPLY" |
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

export function performTLSHandshake(net_socket: libnet.Socket): Promise<libtls.TLSSocket> {
	return new Promise((resolve, reject) => {
		let tls_socket = libtls.connect({
			socket: net_socket,
			rejectUnauthorized: true
		});
		let timeout = setTimeout(() => {
			reject(new Error(`Expected TLS connection to succeed within 10 seconds!`));
		}, 10 * 1000);
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

	toString(): string {
		return `Expected to address to be specified!`;
	}
};

export class MissingFromAddressError extends Error {
	constructor() {
		super();
	}

	toString(): string {
		return `Expected from address to be specified!`;
	}
};

export class MissingReplyAddressError extends Error {
	constructor() {
		super();
	}

	toString(): string {
		return `Expected reply address to be specified!`;
	}
};

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

	protected finishSending(state: State, options: SendOptions, tls_socket: libtls.TLSSocket): Promise<void> {
		let to = this.getTo(options);
		let from = this.getFrom(options);
		let reply = this.getReply(options);
		let attachments = options.attachments ?? [];
		return new Promise((resolve, reject) => {
			let socket = tls_socket as libnet.Socket;
			let ondata: (data: Buffer) => void = (buffer) => {
				let lines = buffer.toString("ascii").split("\r\n");
				console.log(state, lines);
				if (state === "WAITING_FOR_EHLO_REPLY") {
					if (lines[0].startsWith("250")) {
						socket.write(`AUTH PLAIN ${Buffer.from("\0" + this.options.smtp.username + "\0" + this.options.smtp.password).toString("base64")}\r\n`);
						state = "WAITING_FOR_AUTH_REPLY";
					} else {
						socket.write("QUIT\r\n");
						reject(lines);
					}
					return;
				}
				if (state === "WAITING_FOR_AUTH_REPLY") {
					if (lines[0].startsWith("235")) {
						socket.write(`MAIL FROM: <${from.address}>\r\n`);
						state = "WAITING_FOR_MAIL_REPLY";
					} else {
						socket.write("QUIT\r\n");
						reject(lines);
					}
					return;
				}
				if (state === "WAITING_FOR_MAIL_REPLY") {
					if (lines[0].startsWith("250")) {
						socket.write(`RCPT TO: <${to.address}>\r\n`);
						state = "WAITING_FOR_RCPT_REPLY";
					} else {
						socket.write("QUIT\r\n");
						reject(lines);
					}
					return;
				}
				if (state === "WAITING_FOR_RCPT_REPLY") {
					if (lines[0].startsWith("250")) {
						socket.write(`DATA\r\n`);
						state = "WAITING_FOR_DATA_REPLY";
					} else {
						socket.write("QUIT\r\n");
						reject(lines);
					}
					return;
				}
				if (state === "WAITING_FOR_DATA_REPLY") {
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
							socket.write(`${line}\r\n`);
						}
						state = "WAITING_FOR_FINALIZATION";
					} else {
						socket.write("QUIT\r\n");
						reject(lines);
					}
					return;
				}
				if (state === "WAITING_FOR_FINALIZATION") {
					if (lines[0].startsWith("250")) {
						state = "FINISHED";
						socket.write("QUIT\r\n");
						resolve();
					} else {
						socket.write("QUIT\r\n");
						reject(lines);
					}
					return;
				}
			};
			socket.on("data", ondata);
		});
	}

	protected sendExplicit(options: SendOptions): Promise<void> {
		return new Promise((resolve, reject) => {
			let net_socket = libnet.connect({
				host: this.options.smtp.hostname,
				port: this.options.smtp.port
			});
			let socket = net_socket as libnet.Socket;
			let state: State = "WAITING_FOR_GREETING";
			net_socket.once("connect", () => {
				let ondata: (data: Buffer) => void = (buffer) => {
					let lines = buffer.toString("ascii").split("\r\n");
					console.log(state, lines);
					if (state === "WAITING_FOR_GREETING") {
						if (lines[0].startsWith("220")) {
							socket.write(`EHLO mail.example.com\r\n`);
							state = "WAITING_FOR_EHLO_REPLY";
						} else {
							socket.write("QUIT\r\n");
							reject(lines);
						}
						return;
					}
					if (state === "WAITING_FOR_EHLO_REPLY") {
						if (lines[0].startsWith("250")) {
							socket.write(`STARTTLS\r\n`);
							state = "WAITING_FOR_STARTTLS_REPLY";
						} else {
							socket.write("QUIT\r\n");
							reject(lines);
						}
						return;
					}
					if (state === "WAITING_FOR_STARTTLS_REPLY") {
						if (lines[0].startsWith("220")) {
							socket.off("data", ondata);
							performTLSHandshake(socket)
								.then((tls_socket) => {
									tls_socket.write(`EHLO mail.example.com\r\n`);
									state = "WAITING_FOR_EHLO_REPLY";
									resolve(this.finishSending(state, options, tls_socket));
								})
								.catch((error) => {
									reject(error);
								});
						} else {
							socket.write("QUIT\r\n");
							reject(lines);
						}
						return;
					}
				};
				socket.on("data", ondata);
			});
			socket.on("error", (error) => {
				reject(error);
			});
		});
	}

	protected sendImplicit(options: SendOptions): Promise<void> {
		return new Promise((resolve, reject) => {
			let tls_socket = libtls.connect({
				host: this.options.smtp.hostname,
				port: this.options.smtp.port
			});
			let socket = tls_socket as libnet.Socket;
			let state: State = "WAITING_FOR_GREETING";
			let timeout = setTimeout(() => {
				reject(new Error(`Expected TLS connection to succeed within 10 seconds!`));
			}, 10 * 1000);
			tls_socket.once("secureConnect", () => {
				clearTimeout(timeout);
				let ondata: (data: Buffer) => void = (buffer) => {
					let lines = buffer.toString("ascii").split("\r\n");
					console.log(state, lines);
					if (state === "WAITING_FOR_GREETING") {
						if (lines[0].startsWith("220")) {
							socket.off("data", ondata);
							socket.write(`EHLO mail.example.com\r\n`);
							state = "WAITING_FOR_EHLO_REPLY";
							resolve(this.finishSending(state, options, tls_socket));
						} else {
							socket.write("QUIT\r\n");
							reject(lines);
						}
						return;
					}
				};
				socket.on("data", ondata);
			});
			socket.on("error", (error) => {
				reject(error);
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
