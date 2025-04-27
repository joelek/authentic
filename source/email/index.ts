import * as libtls from "tls";
import * as libnet from "net";

export type State =
	"WAITING_FOR_GREETING" |
	"WAITING_FOR_EHLO_REPLY" |
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

export interface Mailer {
	send(options: {
		from_address: string,
		to_address: string,
		reply_address: string,
		subject: string,
		message: string,
		from_name?: string;
		to_name?: string;
		reply_name?: string;
	}): Promise<void>;
};

export type Credentials = {
	hostname: string;
	port: number;
	username: string;
	password: string;
};

export class TestMailer implements Mailer {
	constructor() {}

	async send(options: {
		from_address: string,
		to_address: string,
		reply_address: string,
		subject: string,
		message: string,
		from_name?: string;
		to_name?: string;
		reply_name?: string;
	}): Promise<void> {
		console.log(options);
	}
};

export class SMTPMailer implements Mailer {
	protected credentials: Credentials;

	constructor(credentials: Credentials) {
		this.credentials = { ...credentials };
	}

	send(options: {
		from_address: string,
		to_address: string,
		reply_address: string,
		subject: string,
		message: string,
		from_name?: string;
		to_name?: string;
		reply_name?: string;
	}): Promise<void> {
		return new Promise((resolve, reject) => {
			let tls_socket = libtls.connect({
				host: this.credentials.hostname,
				port: this.credentials.port
			});
			let socket = tls_socket as libnet.Socket;
			let state: State = "WAITING_FOR_GREETING";
			tls_socket.on("secureConnect", () => {
				socket.on("data", (buffer) => {
					let lines = buffer.toString("ascii").split("\r\n");
					console.log(state, lines);
					if (state === "WAITING_FOR_GREETING") {
						if (lines[0].startsWith("220")) {
							socket.write(`EHLO mail.example.com\r\n`);
							state = "WAITING_FOR_EHLO_REPLY";
						} else {
							socket.write("QUIT\r\n");
						}
						return;
					}
					if (state === "WAITING_FOR_EHLO_REPLY") {
						if (lines[0].startsWith("250")) {
							socket.write(`AUTH PLAIN ${Buffer.from("\0" + this.credentials.username + "\0" + this.credentials.password).toString("base64")}\r\n`);
							state = "WAITING_FOR_AUTH_REPLY";
						} else {
							socket.write("QUIT\r\n");
						}
						return;
					}
					if (state === "WAITING_FOR_AUTH_REPLY") {
						if (lines[0].startsWith("235")) {
							socket.write(`MAIL FROM: <${options.from_address}>\r\n`);
							state = "WAITING_FOR_MAIL_REPLY";
						} else {
							socket.write("QUIT\r\n");
						}
						return;
					}
					if (state === "WAITING_FOR_MAIL_REPLY") {
						if (lines[0].startsWith("250")) {
							socket.write(`RCPT TO: <${options.to_address}>\r\n`);
							state = "WAITING_FOR_RCPT_REPLY";
						} else {
							socket.write("QUIT\r\n");
						}
						return;
					}
					if (state === "WAITING_FOR_RCPT_REPLY") {
						if (lines[0].startsWith("250")) {
							socket.write(`DATA\r\n`);
							state = "WAITING_FOR_DATA_REPLY";
						} else {
							socket.write("QUIT\r\n");
						}
						return;
					}
					if (state === "WAITING_FOR_DATA_REPLY") {
						if (lines[0].startsWith("354")) {
							let lines = [
								`MIME-Version: 1.0`,
								`Date: ${new Date().toUTCString()}`,
								`Content-Type: text/plain; charset=utf-8`,
								`Content-Transfer-Encoding: base64`
							];
							if (typeof options?.from_name !== "undefined") {
								lines.push(`From: ${encode(options.from_name)} <${options.from_address}>`);
							} else {
								lines.push(`From: <${options.from_address}>`);
							}
							if (typeof options.to_name !== "undefined") {
								lines.push(`To: ${encode(options.to_name)} <${options.to_address}>`);
							} else {
								lines.push(`To: <${options.to_address}>`);
							}
							if (typeof options.reply_name !== "undefined") {
								lines.push(`Reply-To: ${encode(options.reply_name)} <${options.reply_address}>`);
							} else {
								lines.push(`Reply-To: <${options.reply_address}>`);
							}
							lines.push(`Subject: ${encode(options.subject)}`);
							lines.push(``);
							lines.push(...split(Buffer.from(options.message).toString("base64"), 76));
							lines.push(`.`);
							for (let line of lines) {
								socket.write(`${line}\r\n`);
							}
							state = "WAITING_FOR_FINALIZATION";
						} else {
							socket.write("QUIT\r\n");
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
						}
						return;
					}
				});
			});
			socket.on("error", (error) => {
				reject(error);
			});
		});
	};
};
