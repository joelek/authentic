import * as autoguard from "@joelek/autoguard/dist/lib-server";
import * as libcrypto from "crypto";
import * as libhttp from "http";
import * as libnet from "net";
import * as api from "../api/server";
import { Command } from "../api/server";
import { Mailer, TestMailer } from "../email";
import * as shared from "../shared";
import { ExpectedUnreachableCodeError } from "../shared";
import { Origin, OriginStore, VolatileOriginStore } from "./stores/origins";
import { Session, SessionStore, VolatileSessionStore } from "./stores/session";
import { UserStore, VolatileUserStore } from "./stores/user";
import { Validator } from "./validator";

type AutoguardRoute<A extends autoguard.api.EndpointRequest, B extends autoguard.api.EndpointResponse> = (request: autoguard.api.ClientRequest<A>) => Promise<B>;

type AutoguardRoutes<A extends autoguard.api.RequestMap<A>, B extends autoguard.api.ResponseMap<B>> = autoguard.api.Server<A, B>;

export type Options = {
	users?: UserStore;
	sessions?: SessionStore;
	origins?: OriginStore;
	namespace?: string;
	cookie?: string;
	trusted_proxies?: Array<string>;
	validity_minutes?: number;
	validity_days?: number;
	mailer?: Mailer;
	require_username?: boolean;
	require_passphrase?: boolean;
	require_token?: boolean;
};

export type UserData = {
	id: string;
};

export type AuthenticatedRoute<A extends autoguard.api.EndpointRequest, B extends autoguard.api.EndpointResponse> = (request: autoguard.api.ClientRequest<A>, user_data: UserData) => Promise<B>;

export type AuthenticatedRoutes<A extends autoguard.api.RequestMap<A>, B extends autoguard.api.ResponseMap<B>> = {
	[C in keyof A & keyof B]: AuthenticatedRoute<A[C], B[C]>;
};

export const CookieData = autoguard.guards.Object.of({
	session_id: autoguard.guards.String
},{
	ticket: autoguard.guards.String
});

export type CookieData = ReturnType<typeof CookieData["as"]>;

export class Authenticator {
	protected users: UserStore;
	protected sessions: SessionStore;
	protected origins: OriginStore;
	protected namespace: string;
	protected cookie: string;
	protected trusted_proxies: Array<string>;
	protected validity_minutes: number;
	protected validity_days: number;
	protected mailer: Mailer;
	protected require_username: boolean;
	protected require_passphrase: boolean;
	protected require_token: boolean;

	protected clearSessionState(session: Session & api.WaitingForCommandState): Session {
		return {
			id: session.id,
			type: session.type,
			reason: session.reason,
			expires_utc: session.expires_utc,
			wait_until_utc: this.getExpiresInSeconds(1)
		};
	}

	protected computeHash(string: string): string {
		return libcrypto.createHash("sha256").update(string).digest("hex");
	}

	protected computePassdata(passphrase: string): string {
		return Validator.fromPassphrase(passphrase).toChunk();
	}

	protected createSetCookieValues(session: Session, ticket: string | undefined): Array<string> {
		let cookie_data: CookieData = {
			session_id: session.id,
			ticket: ticket
		};
		let value = Buffer.from(JSON.stringify(cookie_data)).toString("base64url");
		let parts = [
			`${autoguard.api.escapeHeaderKey(this.cookie)}=${autoguard.api.escapeHeaderValue(value)}`,
			`Path=/`,
			`Expires=${new Date(session.expires_utc).toUTCString()}`,
			`HttpOnly`,
			`Secure`,
			`SameSite=Strict`
		];
		return [
			parts.join("; ")
		];
	}

	protected finalizeResponse<A extends autoguard.api.EndpointResponse>(response: A, session: Session, ticket: string | undefined): A {
		let headers = this.getHeaders(response.headers, "set-cookie");
		let set_cookie_values = this.createSetCookieValues(session, ticket);
		return {
			...response,
			headers: {
				...response.headers,
				"set-cookie": [
					...headers,
					...set_cookie_values
				]
			}
		};
	}

	protected generateToken(): string {
		return libcrypto.randomBytes(16).toString("hex");
	}

	protected getExpiresInDays(valid_for_days: number): number {
		return Date.now() + valid_for_days * 24 * 60 * 60 * 1000;
	}

	protected getExpiresInMinutes(valid_for_minutes: number): number {
		return Date.now() + valid_for_minutes * 60 * 1000;
	}

	protected getExpiresInSeconds(valid_for_seconds: number): number {
		return Date.now() + valid_for_seconds * 1000;
	}

	protected getHeaders(all_headers: Record<string, autoguard.api.JSON> | undefined, name: string): Array<string> {
		if (all_headers == null) {
			return [];
		}
		let headers = all_headers[name];
		if (!Array.isArray(headers)) {
			headers = [headers];
		} else {
			headers = [...headers];
		}
		return headers.filter((header): header is string => typeof header === "string");
	}

	protected getCookieData(request: autoguard.api.ClientRequest<autoguard.api.EndpointRequest>): CookieData | undefined {
		let headers = this.getHeaders(request.headers(), "cookie");
		for (let header of headers.reverse()) {
			let header_parts = header.split(";").map((part) => part.trim());
			for (let header_part of header_parts.reverse()) {
				let cookie_parts = header_part.split("=").map((part) => part.trim());
				if (cookie_parts.length !== 2) {
					continue;
				}
				if (cookie_parts[0] === autoguard.api.escapeHeaderKey(this.cookie)) {
					try {
						let string = Buffer.from(cookie_parts[1], "base64url").toString();
						let json = JSON.parse(string);
						return CookieData.as(json);
					} catch (error) {
						throw 400;
					}
				}
			}
		}
	}

	protected getRemoteAddress(request: autoguard.api.ClientRequest<autoguard.api.EndpointRequest>): string {
		let headers = this.getHeaders(request.headers(), "x-forwarded-for");
		let addresses = [] as Array<string>;
		for (let header of headers) {
			let header_parts = header.split(",").map((part) => part.trim());
			for (let header_part of header_parts) {
				let socket_address = libnet.SocketAddress.parse(header_part);
				if (socket_address == null) {
					socket_address = libnet.SocketAddress.parse(`[${header_part}]`);
				}
				if (socket_address == null) {
					throw 400;
				}
				addresses.push(socket_address.address);
			}
		}
		addresses.push((request.socket().address() as libnet.AddressInfo).address);
		for (let address of addresses.reverse()) {
			if (!this.trusted_proxies.includes(address)) {
				return address;
			}
		}
		throw 400;
	}

	protected async getOrigin(address: string): Promise<Origin> {
		let origins = await this.origins.lookupObjects("address", "=", address);
		if (origins.length > 0) {
			let origin = origins.pop();
			if (origin == null) {
				throw new ExpectedUnreachableCodeError();
			}
			return origin;
		}
		return this.origins.createObject({
			address: address,
			wait_until_utc: this.getExpiresInSeconds(0)
		});
	}

	protected async getOriginAndApplyRateLimit(request: autoguard.api.ClientRequest<autoguard.api.EndpointRequest>): Promise<Origin> {
		let address = this.getRemoteAddress(request);
		let origin = await this.getOrigin(address);
		if (Date.now() < origin.wait_until_utc) {
			throw 429;
		}
		return await this.origins.updateObject({
			...origin,
			wait_until_utc: this.getExpiresInSeconds(1)
		});
	}

	protected async getSession(session_id: string | undefined): Promise<Session> {
		if (session_id != null) {
			let session = await this.sessions.lookupObject(session_id).catch(() => undefined);
			if (session != null) {
				return session;
			}
		}
		return this.sessions.createObject({
			type: "WAITING_FOR_COMMAND",
			reason: "COMMAND_REQUIRED",
			expires_utc: this.getExpiresInMinutes(this.validity_minutes),
			wait_until_utc: this.getExpiresInSeconds(0)
		});
	}

	protected async getNextRegisterSession(session: Session, request: autoguard.api.ClientRequest<autoguard.api.EndpointRequest>): Promise<Session> {
		if (this.require_username) {
			if (session.username == null) {
				return {
					...session,
					type: "WAITING_FOR_REGISTER_USERNAME",
					reason: "USERNAME_REQUIRED",
					expires_utc: this.getExpiresInMinutes(this.validity_minutes),
					wait_until_utc: this.getExpiresInSeconds(1)
				};
			} else {
				let users = await this.users.lookupObjects("username", "=", session.username);
				if (users.length > 0) {
					let username_attempts = (session.username_attempts ?? 0) + 1;
					return {
						...session,
						username_attempts: username_attempts,
						type: "WAITING_FOR_REGISTER_USERNAME",
						reason: "USERNAME_NOT_AVAILABLE",
						expires_utc: this.getExpiresInMinutes(this.validity_minutes),
						wait_until_utc: this.getExpiresInSeconds(1)
					};
				}
			}
		}
		if (session.email == null) {
			return {
				...session,
				type: "WAITING_FOR_REGISTER_EMAIL",
				reason: "EMAIL_REQUIRED",
				expires_utc: this.getExpiresInMinutes(this.validity_minutes),
				wait_until_utc: this.getExpiresInSeconds(1)
			};
		}
		let users = await this.users.lookupObjects("email", "=", session.email);
		if (users.length > 0) {
			let email_attempts = (session.email_attempts ?? 0) + 1;
			return {
				...session,
				email_attempts: email_attempts,
				type: "WAITING_FOR_REGISTER_EMAIL",
				reason: "EMAIL_NOT_AVAILABLE",
				expires_utc: this.getExpiresInMinutes(this.validity_minutes),
				wait_until_utc: this.getExpiresInSeconds(1)
			};
		}
		if (this.require_token || !this.require_passphrase) {
			if (session.token_hash == null) {
				let token = this.generateToken();
				await this.sendEmail(session.email, token, request);
				return {
					...session,
					token_hash: this.computeHash(token),
					type: "WAITING_FOR_REGISTER_TOKEN",
					reason: "TOKEN_REQUIRED",
					expires_utc: this.getExpiresInMinutes(this.validity_minutes),
					wait_until_utc: this.getExpiresInSeconds(1)
				};
			}
		}
		if (this.require_passphrase) {
			if (session.passdata == null) {
				return {
					...session,
					type: "WAITING_FOR_REGISTER_PASSPHRASE",
					reason: "PASSPHRASE_REQUIRED",
					expires_utc: this.getExpiresInMinutes(this.validity_minutes),
					wait_until_utc: this.getExpiresInSeconds(1)
				};
			}
		}
		let user = await this.users.createObject({
			email: session.email,
			username: session.username,
			passdata: session.passdata ?? Validator.fromPassphrase(this.generateToken()).toChunk()
		});
		return {
			id: session.id,
			user_id: user.id,
			type: "REGISTERED",
			reason: "REGISTRATION_COMPLETED",
			expires_utc: this.getExpiresInDays(this.validity_days),
			wait_until_utc: this.getExpiresInSeconds(1)
		};
	}

	protected async getNextAuthenticateSession(session: Session, request: autoguard.api.ClientRequest<autoguard.api.EndpointRequest>): Promise<Session> {
		if (this.require_username) {
			if (session.username != null) {
				let users = await this.users.lookupObjects("username", "=", session.username);
				if (users.length === 0) {
					let username_attempts = (session.username_attempts ?? 0) + 1;
					return {
						...session,
						username_attempts: username_attempts,
						type: "WAITING_FOR_AUTHENTICATE_USERNAME",
						reason: "USERNAME_NOT_AVAILABLE",
						expires_utc: this.getExpiresInMinutes(this.validity_minutes),
						wait_until_utc: this.getExpiresInSeconds(1)
					};
				}
			}
		}
		if (session.email == null) {
			return {
				...session,
				type: "WAITING_FOR_AUTHENTICATE_EMAIL",
				reason: "EMAIL_REQUIRED",
				expires_utc: this.getExpiresInMinutes(this.validity_minutes),
				wait_until_utc: this.getExpiresInSeconds(1)
			};
		}
		let users = await this.users.lookupObjects("email", "=", session.email);
		if (users.length === 0) {
			let email_attempts = (session.email_attempts ?? 0) + 1;
			return {
				...session,
				email_attempts: email_attempts,
				type: "WAITING_FOR_AUTHENTICATE_EMAIL",
				reason: "EMAIL_NOT_AVAILABLE",
				expires_utc: this.getExpiresInMinutes(this.validity_minutes),
				wait_until_utc: this.getExpiresInSeconds(1)
			};
		}
		let user = users.pop();
		if (user == null) {
			throw new ExpectedUnreachableCodeError();
		}
		if (this.require_token || !this.require_passphrase) {
			if (session.token_hash == null) {
				let token = this.generateToken();
				await this.sendEmail(session.email, token, request);
				return {
					...session,
					token_hash: this.computeHash(token),
					type: "WAITING_FOR_AUTHENTICATE_TOKEN",
					reason: "TOKEN_REQUIRED",
					expires_utc: this.getExpiresInMinutes(this.validity_minutes),
					wait_until_utc: this.getExpiresInSeconds(1)
				};
			}
		}
		if (this.require_passphrase) {
			if (session.passdata == null) {
				return {
					...session,
					passdata: user.passdata,
					type: "WAITING_FOR_AUTHENTICATE_PASSPHRASE",
					reason: "PASSPHRASE_REQUIRED",
					expires_utc: this.getExpiresInMinutes(this.validity_minutes),
					wait_until_utc: this.getExpiresInSeconds(1)
				};
			}
		}
		return {
			id: session.id,
			user_id: user.id,
			type: "AUTHENTICATED",
			reason: "AUTHENTICATION_COMPLETED",
			expires_utc: this.getExpiresInDays(this.validity_days),
			wait_until_utc: this.getExpiresInSeconds(1)
		};
	}

	protected async getNextRecoverSession(session: Session, request: autoguard.api.ClientRequest<autoguard.api.EndpointRequest>): Promise<Session> {
		if (session.username != null) {
			let users = await this.users.lookupObjects("username", "=", session.username);
			if (users.length === 0) {
				let username_attempts = (session.username_attempts ?? 0) + 1;
				return {
					...session,
					username_attempts: username_attempts,
					type: "WAITING_FOR_RECOVER_USERNAME",
					reason: "USERNAME_NOT_AVAILABLE",
					expires_utc: this.getExpiresInMinutes(this.validity_minutes),
					wait_until_utc: this.getExpiresInSeconds(1)
				};
			}
		}
		if (session.email == null) {
			return {
				...session,
				type: "WAITING_FOR_RECOVER_EMAIL",
				reason: "EMAIL_REQUIRED",
				expires_utc: this.getExpiresInMinutes(this.validity_minutes),
				wait_until_utc: this.getExpiresInSeconds(1)
			};
		}
		let users = await this.users.lookupObjects("email", "=", session.email);
		if (users.length === 0) {
			let email_attempts = (session.email_attempts ?? 0) + 1;
			return {
				...session,
				email_attempts: email_attempts,
				type: "WAITING_FOR_RECOVER_EMAIL",
				reason: "EMAIL_NOT_AVAILABLE",
				expires_utc: this.getExpiresInMinutes(this.validity_minutes),
				wait_until_utc: this.getExpiresInSeconds(1)
			};
		}
		let user = users.pop();
		if (user == null) {
			throw new ExpectedUnreachableCodeError();
		}
		if (session.token_hash == null) {
			let token = this.generateToken();
			await this.sendEmail(session.email, token, request);
			return {
				...session,
				token_hash: this.computeHash(token),
				type: "WAITING_FOR_RECOVER_TOKEN",
				reason: "TOKEN_REQUIRED",
				expires_utc: this.getExpiresInMinutes(this.validity_minutes),
				wait_until_utc: this.getExpiresInSeconds(1)
			};
		}
		if (this.require_passphrase) {
			if (session.passdata == null) {
				return {
					...session,
					type: "WAITING_FOR_RECOVER_PASSPHRASE",
					reason: "PASSPHRASE_REQUIRED",
					expires_utc: this.getExpiresInMinutes(this.validity_minutes),
					wait_until_utc: this.getExpiresInSeconds(1)
				};
			}
		}
		return {
			id: session.id,
			user_id: user.id,
			type: "RECOVERED",
			reason: "RECOVERY_COMPLETED",
			expires_utc: this.getExpiresInDays(this.validity_days),
			wait_until_utc: this.getExpiresInSeconds(1)
		};
	}

	protected async getNextSession(session: Session, command: Command, request: autoguard.api.ClientRequest<autoguard.api.EndpointRequest>): Promise<Session> {
		if (api.ResetStateCommand.is(command)) {
			return {
				id: session.id,
				type: "WAITING_FOR_COMMAND",
				reason: "COMMAND_REQUIRED",
				expires_utc: this.getExpiresInMinutes(this.validity_minutes),
				wait_until_utc: this.getExpiresInSeconds(1)
			};
		}
		if (session.expires_utc <= Date.now()) {
			return {
				id: session.id,
				type: "WAITING_FOR_COMMAND",
				reason: "SESSION_EXPIRED",
				expires_utc: this.getExpiresInMinutes(this.validity_minutes),
				wait_until_utc: this.getExpiresInSeconds(1)
			};
		}
		if (api.WaitingForCommandState.is(session)) {
			if (api.RegisterCommand.is(command)) {
				return this.getNextRegisterSession(this.clearSessionState(session), request);
			}
			if (api.AuthenticateCommand.is(command)) {
				return this.getNextAuthenticateSession(this.clearSessionState(session), request);
			}
			if (api.RecoverCommand.is(command)) {
				return this.getNextRecoverSession(this.clearSessionState(session), request);
			}
		} else if (api.WaitingForRegisterUsernameState.is(session)) {
			if (api.RegisterUsernameCommand.is(command)) {
				if (!this.validateUsernameFormat(command.username)) {
					return {
						...session,
						type: "WAITING_FOR_REGISTER_USERNAME",
						reason: "USERNAME_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.validity_minutes),
						wait_until_utc: this.getExpiresInSeconds(1)
					};
				}
				return this.getNextRegisterSession({
					...session,
					username: command.username
				}, request);
			}
		} else if (api.WaitingForRegisterEmailState.is(session)) {
			if (api.RegisterEmailCommand.is(command)) {
				if (!this.validateEmailFormat(command.email)) {
					return {
						...session,
						type: "WAITING_FOR_REGISTER_EMAIL",
						reason: "EMAIL_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.validity_minutes),
						wait_until_utc: this.getExpiresInSeconds(1)
					};
				}
				return this.getNextRegisterSession({
					...session,
					email: command.email
				}, request);
			}
		} else if (api.WaitingForRegisterTokenState.is(session)) {
			if (api.RegisterTokenCommand.is(command)) {
				let token_hash = this.computeHash(command.token);
				if (session.token_hash == null || session.token_hash !== token_hash) {
					let token_hash_attempts = (session.token_hash_attempts ?? 0) + 1;
					return {
						...session,
						token_hash_attempts: token_hash_attempts,
						type: "WAITING_FOR_REGISTER_TOKEN",
						reason: "TOKEN_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.validity_minutes),
						wait_until_utc: this.getExpiresInSeconds(1)
					};
				}
				return this.getNextRegisterSession({
					...session
				}, request);
			}
		} else if (api.WaitingForRegisterPassphraseState.is(session)) {
			if (api.RegisterPassphraseCommand.is(command)) {
				if (!this.validatePassphraseFormat(command.passphrase)) {
					return {
						...session,
						type: "WAITING_FOR_REGISTER_PASSPHRASE",
						reason: "PASSPHRASE_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.validity_minutes),
						wait_until_utc: this.getExpiresInSeconds(1)
					};
				}
				let passdata = this.computePassdata(command.passphrase);
				return this.getNextRegisterSession({
					...session,
					passdata: passdata
				}, request);
			}
		} else if (api.WaitingForAuthenticateUsernameState.is(session)) {
			if (api.AuthenticateUsernameCommand.is(command)) {
				if (!this.validateUsernameFormat(command.username)) {
					return {
						...session,
						type: "WAITING_FOR_AUTHENTICATE_USERNAME",
						reason: "USERNAME_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.validity_minutes),
						wait_until_utc: this.getExpiresInSeconds(1)
					};
				}
				return this.getNextAuthenticateSession({
					...session,
					username: command.username
				}, request);
			}
		} else if (api.WaitingForAuthenticateEmailState.is(session)) {
			if (api.AuthenticateEmailCommand.is(command)) {
				if (!this.validateEmailFormat(command.email)) {
					return {
						...session,
						type: "WAITING_FOR_AUTHENTICATE_EMAIL",
						reason: "EMAIL_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.validity_minutes),
						wait_until_utc: this.getExpiresInSeconds(1)
					};
				}
				return this.getNextAuthenticateSession({
					...session,
					email: command.email
				}, request);
			}
		} else if (api.WaitingForAuthenticateTokenState.is(session)) {
			if (api.AuthenticateTokenCommand.is(command)) {
				let token_hash = this.computeHash(command.token);
				if (session.token_hash == null || session.token_hash !== token_hash) {
					let token_hash_attempts = (session.token_hash_attempts ?? 0) + 1;
					return {
						...session,
						token_hash_attempts: token_hash_attempts,
						type: "WAITING_FOR_AUTHENTICATE_TOKEN",
						reason: "TOKEN_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.validity_minutes),
						wait_until_utc: this.getExpiresInSeconds(1)
					};
				}
				return this.getNextAuthenticateSession({
					...session
				}, request);
			}
		} else if (api.WaitingForAuthenticatePassphraseState.is(session)) {
			if (api.AuthenticatePassphraseCommand.is(command)) {
				if (session.passdata == null || !Validator.fromChunk(session.passdata).verify(command.passphrase)) {
					let passdata_attempts = (session.passdata_attempts ?? 0) + 1;
					return {
						...session,
						passdata_attempts: passdata_attempts,
						type: "WAITING_FOR_AUTHENTICATE_PASSPHRASE",
						reason: "PASSPHRASE_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.validity_minutes),
						wait_until_utc: this.getExpiresInSeconds(1)
					};
				}
				return this.getNextAuthenticateSession({
					...session,
					passdata: this.computePassdata(command.passphrase)
				}, request);
			}
		} else if (api.WaitingForRecoverUsernameState.is(session)) {
			if (api.RecoverUsernameCommand.is(command)) {
				if (!this.validateUsernameFormat(command.username)) {
					return {
						...session,
						type: "WAITING_FOR_RECOVER_USERNAME",
						reason: "USERNAME_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.validity_minutes),
						wait_until_utc: this.getExpiresInSeconds(1)
					};
				}
				return this.getNextRecoverSession({
					...session,
					username: command.username
				}, request);
			}
		} else if (api.WaitingForRecoverEmailState.is(session)) {
			if (api.RecoverEmailCommand.is(command)) {
				if (!this.validateEmailFormat(command.email)) {
					return {
						...session,
						type: "WAITING_FOR_RECOVER_EMAIL",
						reason: "EMAIL_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.validity_minutes),
						wait_until_utc: this.getExpiresInSeconds(1)
					};
				}
				return this.getNextRecoverSession({
					...session,
					email: command.email
				}, request);
			}
		} else if (api.WaitingForRecoverTokenState.is(session)) {
			if (api.RecoverTokenCommand.is(command)) {
				let token_hash = this.computeHash(command.token);
				if (session.token_hash == null || session.token_hash !== token_hash) {
					let token_hash_attempts = (session.token_hash_attempts ?? 0) + 1;
					return {
						...session,
						token_hash_attempts: token_hash_attempts,
						type: "WAITING_FOR_RECOVER_TOKEN",
						reason: "TOKEN_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.validity_minutes),
						wait_until_utc: this.getExpiresInSeconds(1)
					};
				}
				return this.getNextRecoverSession({
					...session
				}, request);
			}
		} else if (api.WaitingForRecoverPassphraseState.is(session)) {
			if (api.RecoverPassphraseCommand.is(command)) {
				if (!this.validatePassphraseFormat(command.passphrase)) {
					return {
						...session,
						type: "WAITING_FOR_RECOVER_PASSPHRASE",
						reason: "PASSPHRASE_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.validity_minutes),
						wait_until_utc: this.getExpiresInSeconds(1)
					};
				}
				let passdata = this.computePassdata(command.passphrase);
				return this.getNextRecoverSession({
					...session,
					passdata: passdata
				}, request);
			}
		}
		return {
			id: session.id,
			type: "WAITING_FOR_COMMAND",
			reason: "INVALID_COMMAND",
			expires_utc: this.getExpiresInMinutes(this.validity_minutes),
			wait_until_utc: this.getExpiresInSeconds(1)
		};
	}

	protected async sendEmail(to_address: string, message: string, request: autoguard.api.ClientRequest<autoguard.api.EndpointRequest>): Promise<void> {
		let spoofable_host = this.getHeaders(request.headers(), "host").pop() ?? "localhost";
		await this.mailer.send({
			from_address: `postmaster@${spoofable_host}`,
			reply_address: `postmaster@${spoofable_host}`,
			subject: spoofable_host,
			message: message,
			to_address: to_address
		});
	}

	protected validateEmailFormat(email: string): boolean {
		return /^([0-9a-z!#$%&'*+/=?^_`{|}~-]+(?:[\.][0-9a-z!#$%&'*+/=?^_`{|}~-]+)*)[@]([0-9a-z](?:[0-9a-z-]*[0-9a-z])?(?:[\.][0-9a-z](?:[0-9a-z-]*[0-9a-z])?)*)$/iu.test(email);
	}

	protected validatePassphraseFormat(passphrase: string): boolean {
		return /^(.{8,})$/iu.test(passphrase);
	}

	protected validateUsernameFormat(username: string): boolean {
		return /^([a-z0-9_]+)$/iu.test(username);
	}

	protected readState: Parameters<typeof api.makeServer>[0]["readState"] = async (request) => {
		let origin = await this.getOriginAndApplyRateLimit(request);
		let { session_id, ticket } = this.getCookieData(request) ?? {};
		let session = await this.getSession(session_id);
		if (Date.now() < session.wait_until_utc) {
			throw 429;
		}
		let state: api.State = api.State.as({
			type: session.type,
			reason: session.reason
		});
		return this.finalizeResponse({
			payload: {
				state,
				wait_ms: Math.max(0, Math.max(origin.wait_until_utc, session.wait_until_utc) - Date.now())
			}
		}, session, ticket);
	};

	protected sendCommand: Parameters<typeof api.makeServer>[0]["sendCommand"] = async (request) => {
		let origin = await this.getOriginAndApplyRateLimit(request);
		let { session_id, ticket } = this.getCookieData(request) ?? {};
		let session = await this.getSession(session_id);
		if (Date.now() < session.wait_until_utc) {
			throw 429;
		}
		let payload = await request.payload(1024);
		session = await this.getNextSession(session, payload.command, request);
		if (api.AuthenticatedState.is(session) || api.RegisteredState.is(session) || api.RecoveredState.is(session)) {
			ticket = this.generateToken();
			session.ticket_hash = this.computeHash(ticket);
		}
		await this.sessions.updateObject(session);
		let state: api.State = api.State.as({
			type: session.type,
			reason: session.reason
		});
		return this.finalizeResponse({
			payload: {
				state,
				wait_ms: Math.max(0, Math.max(origin.wait_until_utc, session.wait_until_utc) - Date.now())
			}
		}, session, ticket);
	};

	constructor(options?: Options) {
		this.users = options?.users ?? new VolatileUserStore();
		this.sessions = options?.sessions ?? new VolatileSessionStore();
		this.origins = options?.origins ?? new VolatileOriginStore();
		this.namespace = options?.namespace ?? "auth";
		this.cookie = options?.cookie ?? "session";
		this.trusted_proxies = options?.trusted_proxies?.slice() ?? [];
		this.validity_minutes = options?.validity_minutes ?? 20;
		this.validity_days = options?.validity_days ?? 14;
		this.mailer = options?.mailer ?? new TestMailer();
		this.require_username = options?.require_username ?? false;
		this.require_passphrase = options?.require_passphrase ?? false;
		this.require_token = options?.require_token ?? true;
	}

	wrapRoute<A extends autoguard.api.EndpointRequest, B extends autoguard.api.EndpointResponse>(route: AuthenticatedRoute<A, B>): AutoguardRoute<A, B> {
		return async (request) => {
			let { session_id, ticket } = this.getCookieData(request) ?? {};
			if (session_id == null) {
				throw 401;
			};
			if (ticket == null) {
				throw 401;
			}
			let session = await this.sessions.lookupObject(session_id).catch(() => undefined);
			if (session == null) {
				throw 401;
			}
			if (session.expires_utc <= Date.now()) {
				await this.sessions.deleteObject(session_id);
				throw 401;
			}
			if (session.user_id == null) {
				throw 401;
			}
			if (session.token_hash == null) {
				throw 401;
			}
			let ticket_hash = this.computeHash(ticket);
			if (session.ticket_hash !== ticket_hash) {
				throw 401;
			}
			session.expires_utc = this.getExpiresInDays(this.validity_days);
			await this.sessions.updateObject(session);
			let user = await this.users.lookupObject(session.user_id);
			let user_data: UserData = {
				id: user.id
			};
			let response = await route(request, user_data);
			return this.finalizeResponse(response, session, ticket);
		};
	}

	wrapRoutes<A extends autoguard.api.RequestMap<A>, B extends autoguard.api.ResponseMap<B>>(routes: AuthenticatedRoutes<A, B>): AutoguardRoutes<A, B> {
		let wrapped_routes = {} as autoguard.api.Server<A, B>;
		for (let key in routes) {
			wrapped_routes[key as keyof A & keyof B] = this.wrapRoute(routes[key as keyof A & keyof B]);
		}
		return wrapped_routes;
	}

	createRequestListener(): libhttp.RequestListener {
		let urlPrefix = shared.getUrlPrefix(this.namespace);
		return api.makeServer({
			readState: this.readState,
			sendCommand: this.sendCommand,
		}, {
			urlPrefix
		});
	}

	createRoutedRequestListener(requestListener: libhttp.RequestListener): libhttp.RequestListener {
		let authenticRequestListener = this.createRequestListener();
		return (request, response) => {
			let url = request.url ?? "/";
			let urlPrefix = shared.getUrlPrefix(this.namespace);
			if (url.startsWith(`${urlPrefix}/`)) {
				return authenticRequestListener(request, response);
			} else {
				return requestListener(request, response);
			}
		};
	}
};
