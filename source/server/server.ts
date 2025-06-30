import * as autoguard from "@joelek/autoguard/dist/lib-server";
import * as libcrypto from "crypto";
import * as libhttp from "http";
import * as libnet from "net";
import * as api from "../api/server";
import { Command } from "../api/server";
import { Mailer, TestMailer } from "../email";
import { ExpectedUnreachableCodeError, Language } from "../shared";
import { Origin, OriginStore, VolatileOriginStore } from "./stores/origin";
import { RoleStore, VolatileRoleStore } from "./stores/role";
import { Session, SessionStore, VolatileSessionStore } from "./stores/session";
import { UserStore, VolatileUserStore } from "./stores/user";
import { UserRoleStore, VolatileUserRoleStore } from "./stores/user_role";
import * as utils from "./utils";
import { Validator } from "./validator";

type AutoguardRoute<A extends autoguard.api.EndpointRequest, B extends autoguard.api.EndpointResponse> = (request: autoguard.api.ClientRequest<A>) => Promise<B>;

type AutoguardRoutes<A extends autoguard.api.RequestMap<A>, B extends autoguard.api.ResponseMap<B>> = autoguard.api.Server<A, B>;

type EmailTemplate = {
	[A in Language]: {
		subject: string;
		message: string;
	};
};

const WAITING_FOR_REGISTER_TOKEN_EMAIL_TEMPLATE: EmailTemplate = {
	en: {
		subject: "Verification code",
		message: "The verification code is: {token}"
	},
	sv: {
		subject: "Verifieringskod",
		message: "Verifieringskoden är: {token}"
	}
};

const WAITING_FOR_AUTHENTICATE_TOKEN_EMAIL_TEMPLATE: EmailTemplate = {
	en: {
		subject: "Verification code",
		message: "The verification code is: {token}"
	},
	sv: {
		subject: "Verifieringskod",
		message: "Verifieringskoden är: {token}"
	}
};

const WAITING_FOR_RECOVER_TOKEN_EMAIL_TEMPLATE: EmailTemplate = {
	en: {
		subject: "Verification code",
		message: "The verification code is: {token}"
	},
	sv: {
		subject: "Verifieringskod",
		message: "Verifieringskoden är: {token}"
	}
};

export type ServerOptions = {
	users?: UserStore;
	sessions?: SessionStore;
	origins?: OriginStore;
	roles?: RoleStore;
	user_roles?: UserRoleStore;
	cookie?: string;
	trusted_proxies?: Array<string>;
	session_validity_minutes?: number;
	authenticated_session_validity_days?: number;
	origin_validity_minutes?: number;
	mailer?: Mailer;
	require_username?: boolean;
	require_passphrase?: boolean;
	require_token?: boolean;
	tolerable_username_attempts?: number;
	tolerable_email_attempts?: number;
	tolerable_token_hash_attempts?: number;
	tolerable_passdata_attempts?: number;
	clean_expired_interval_minutes?: number;
	waiting_for_register_token_email_template?: EmailTemplate;
	waiting_for_authenticate_token_email_template?: EmailTemplate;
	waiting_for_recover_token_email_template?: EmailTemplate;
};

export class AccessHandler {
	protected authenticated_user_id: string | undefined;
	protected roles: Array<string>;

	constructor(authenticated_user_id: string | undefined, roles: Array<string>) {
		this.authenticated_user_id = authenticated_user_id;
		this.roles = roles;
	}

	requireAuthorization(...roles: Array<string>): string {
		if (this.authenticated_user_id == null) {
			throw 401;
		}
		for (let role of roles) {
			if (!this.roles.includes(role)) {
				throw 401;
			}
		}
		return this.authenticated_user_id;
	}
};

export type AuthenticatedRoute<A extends autoguard.api.EndpointRequest, B extends autoguard.api.EndpointResponse> = (request: autoguard.api.ClientRequest<A>, access_handler: AccessHandler) => Promise<B>;

export type AuthenticatedRoutes<A extends autoguard.api.RequestMap<A>, B extends autoguard.api.ResponseMap<B>> = {
	[C in keyof A & keyof B]: AuthenticatedRoute<A[C], B[C]>;
};

export const CookieData = autoguard.guards.Object.of({
	session_id: autoguard.guards.String
},{
	ticket: autoguard.guards.String
});

export type CookieData = ReturnType<typeof CookieData["as"]>;

export class Server {
	protected users: UserStore;
	protected sessions: SessionStore;
	protected origins: OriginStore;
	protected roles: RoleStore;
	protected user_roles: UserRoleStore;
	protected cookie: string;
	protected trusted_proxies: Array<string>;
	protected session_validity_minutes: number;
	protected authenticated_session_validity_days: number;
	protected origin_validity_minutes: number;
	protected mailer: Mailer;
	protected require_username: boolean;
	protected require_passphrase: boolean;
	protected require_token: boolean;
	protected tolerable_username_attempts: number;
	protected tolerable_email_attempts: number;
	protected tolerable_token_hash_attempts: number;
	protected tolerable_passdata_attempts: number;
	protected clean_expired_interval_minutes: number;
	protected waiting_for_register_token_email_template: EmailTemplate;
	protected waiting_for_authenticate_token_email_template: EmailTemplate;
	protected waiting_for_recover_token_email_template: EmailTemplate;

	protected computeHash(string: string): string {
		return libcrypto.createHash("sha256").update(string).digest("hex");
	}

	protected computePassdata(passphrase: string): string {
		return Validator.fromPassphrase(passphrase).toChunk();
	}

	protected async createAccessHandler(authenticated_user_id: string | undefined): Promise<AccessHandler> {
		if (authenticated_user_id == null) {
			return new AccessHandler(authenticated_user_id, []);
		} else {
			let user_roles = await this.user_roles.lookupObjects("user_id", "=", authenticated_user_id);
			let roles = await Promise.all(user_roles.map((user_role) => this.roles.lookupObject(user_role.role_id)));
			return new AccessHandler(authenticated_user_id, roles.map((role) => role.name));
		}
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

	protected generateToken(length: number): string {
		return utils.generateDigitId(length);
	}

	protected generateTicket(length: number): string {
		return utils.generateHexId(length);
	}

	protected getApiState(session: Session): api.State {
		return api.State.as({
			type: session.type,
			reason: session.reason
		});
	}

	protected async getApiUser(session: Session): Promise<api.User | undefined> {
		if (session.authenticated_user_id == null) {
			return;
		}
		let user = await this.users.lookupObject(session.authenticated_user_id);
		let user_roles = await this.user_roles.lookupObjects("user_id", "=", session.authenticated_user_id);
		let roles = await Promise.all(user_roles.map((user_role) => this.roles.lookupObject(user_role.role_id)));
		return {
			id: user.id,
			email: user.email,
			username: user.username ?? undefined,
			roles: roles.map((role) => role.name)
		};
	}

	protected async getAuthenticatedUserId(session: Session, ticket: string | undefined): Promise<string | undefined> {
		if (ticket == null) {
			return;
		}
		if (session.expires_utc <= Date.now()) {
			return;
		}
		if (session.authenticated_user_id == null) {
			return;
		}
		if (session.ticket_hash == null) {
			return;
		}
		let ticket_hash = this.computeHash(ticket);
		if (session.ticket_hash !== ticket_hash) {
			return;
		}
		session.expires_utc = this.getExpiresInDays(this.authenticated_session_validity_days);
		await this.sessions.updateObject(session);
		return session.authenticated_user_id;
	}

	protected getExpiresInDays(valid_for_days: number): number {
		return Date.now() + valid_for_days * 24 * 60 * 60 * 1000;
	}

	protected getExpiresInHours(valid_for_hours: number): number {
		return Date.now() + valid_for_hours * 60 * 60 * 1000;
	}

	protected getExpiresInMinutes(valid_for_minutes: number): number {
		return Date.now() + valid_for_minutes * 60 * 1000;
	}

	protected getExpiresInSeconds(valid_for_seconds: number): number {
		return Date.now() + valid_for_seconds * 1000;
	}

	protected getExpiresInMilliseconds(valid_for_milliseconds: number): number {
		return Date.now() + valid_for_milliseconds;
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

	protected getUserLanguage(request: autoguard.api.ClientRequest<autoguard.api.EndpointRequest>): Language {
		let headers = this.getHeaders(request.headers(), "accept-language");
		for (let header of headers) {
			let header_parts = header.split(",").map((part) => part.trim());
			for (let header_part of header_parts) {
				let language = header_part.split(";")[0].split("-")[0];
				if (Language.is(language)) {
					return language;
				}
			}
		}
		return "en";
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
			expires_utc: this.getExpiresInMinutes(this.origin_validity_minutes),
			wait_until_utc: this.getExpiresInMilliseconds(0)
		});
	}

	protected checkRateLimit(wait_until_utc: number): void {
		let wait_ms = wait_until_utc - Date.now();
		if (wait_ms > 0) {
			throw new autoguard.api.EndpointError({
				status: 429,
				headers: [
					["retry-after", String(Math.ceil(wait_ms / 1000))]
				]
			});
		}
	}

	protected async getOriginAndApplyRateLimit(request: autoguard.api.ClientRequest<autoguard.api.EndpointRequest>): Promise<Origin> {
		let address = this.getRemoteAddress(request);
		let origin = await this.getOrigin(address);
		this.checkRateLimit(origin.wait_until_utc);
		return await this.origins.updateObject({
			...origin,
			expires_utc: this.getExpiresInMinutes(this.origin_validity_minutes),
			wait_until_utc: this.getExpiresInMilliseconds(250)
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
			expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
			wait_until_utc: this.getExpiresInMilliseconds(0)
		});
	}

	protected async getNextRegisterSession(session: Session, request: autoguard.api.ClientRequest<autoguard.api.EndpointRequest>): Promise<Session> {
		let language = this.getUserLanguage(request);
		if (this.require_username) {
			if (session.username == null) {
				return {
					...session,
					type: "WAITING_FOR_REGISTER_USERNAME",
					reason: "REGISTER_USERNAME_REQUIRED",
					expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
					wait_until_utc: this.getExpiresInMilliseconds(250)
				};
			} else {
				let users = await this.users.lookupObjects("username", "=", session.username);
				if (users.length > 0) {
					let username_attempts = (session.username_attempts ?? 0) + 1;
					return {
						...session,
						username_attempts: username_attempts,
						type: "WAITING_FOR_REGISTER_USERNAME",
						reason: "REGISTER_USERNAME_NOT_AVAILABLE",
						expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
						wait_until_utc: this.getExpiresInMilliseconds(250 * 2 ** Math.max(0, username_attempts - this.tolerable_username_attempts))
					};
				}
			}
		}
		if (session.email == null) {
			return {
				...session,
				type: "WAITING_FOR_REGISTER_EMAIL",
				reason: "REGISTER_EMAIL_REQUIRED",
				expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
				wait_until_utc: this.getExpiresInMilliseconds(250)
			};
		}
		let users = await this.users.lookupObjects("email", "=", session.email);
		if (users.length > 0) {
			let email_attempts = (session.email_attempts ?? 0) + 1;
			return {
				...session,
				token_hash: undefined,
				token_hash_attempts: undefined,
				email_attempts: email_attempts,
				type: "WAITING_FOR_REGISTER_EMAIL",
				reason: "REGISTER_EMAIL_NOT_AVAILABLE",
				expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
				wait_until_utc: this.getExpiresInMilliseconds(250 * 2 ** Math.max(0, email_attempts - this.tolerable_email_attempts))
			};
		}
		if (this.require_token || !this.require_passphrase) {
			if (session.token_hash == null) {
				let token = this.generateToken(15);
				let subject = this.processEmailTemplateString(this.waiting_for_register_token_email_template[language].subject, {
					token
				});
				let message = this.processEmailTemplateString(this.waiting_for_register_token_email_template[language].message, {
					token
				});
				await this.sendEmail(session.email, subject, message);
				return {
					...session,
					token_hash: this.computeHash(token),
					type: "WAITING_FOR_REGISTER_TOKEN",
					reason: "REGISTER_TOKEN_REQUIRED",
					expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
					wait_until_utc: this.getExpiresInMilliseconds(250)
				};
			}
		}
		if (this.require_passphrase) {
			if (session.passdata == null) {
				return {
					...session,
					type: "WAITING_FOR_REGISTER_PASSPHRASE",
					reason: "REGISTER_PASSPHRASE_REQUIRED",
					expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
					wait_until_utc: this.getExpiresInMilliseconds(250)
				};
			}
		}
		let user = await this.users.createObject({
			email: session.email,
			username: session.username,
			passdata: session.passdata ?? Validator.fromPassphrase(this.generateTicket(32)).toChunk()
		});
		return {
			id: session.id,
			authenticated_user_id: user.id,
			type: "AUTHENTICATED",
			reason: "REGISTRATION_COMPLETED",
			expires_utc: this.getExpiresInDays(this.authenticated_session_validity_days),
			wait_until_utc: this.getExpiresInMilliseconds(250)
		};
	}

	protected async getNextAuthenticateSession(session: Session, request: autoguard.api.ClientRequest<autoguard.api.EndpointRequest>): Promise<Session> {
		let language = this.getUserLanguage(request);
		if (this.require_username) {
			if (session.username != null) {
				let users = await this.users.lookupObjects("username", "=", session.username);
				if (users.length === 0) {
					let username_attempts = (session.username_attempts ?? 0) + 1;
					return {
						...session,
						username_attempts: username_attempts,
						type: "WAITING_FOR_AUTHENTICATE_USERNAME",
						reason: "AUTHENTICATE_USERNAME_NOT_AVAILABLE",
						expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
						wait_until_utc: this.getExpiresInMilliseconds(250 * 2 ** Math.max(0, username_attempts - this.tolerable_username_attempts))
					};
				}
			}
		}
		if (session.email == null) {
			return {
				...session,
				type: "WAITING_FOR_AUTHENTICATE_EMAIL",
				reason: "AUTHENTICATE_EMAIL_REQUIRED",
				expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
				wait_until_utc: this.getExpiresInMilliseconds(250)
			};
		}
		let users = await this.users.lookupObjects("email", "=", session.email);
		if (users.length === 0) {
			let email_attempts = (session.email_attempts ?? 0) + 1;
			return {
				...session,
				token_hash: undefined,
				token_hash_attempts: undefined,
				email_attempts: email_attempts,
				type: "WAITING_FOR_AUTHENTICATE_EMAIL",
				reason: "AUTHENTICATE_EMAIL_NOT_AVAILABLE",
				expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
				wait_until_utc: this.getExpiresInMilliseconds(250 * 2 ** Math.max(0, email_attempts - this.tolerable_email_attempts))
			};
		}
		let user = users.pop();
		if (user == null) {
			throw new ExpectedUnreachableCodeError();
		}
		if (this.require_token || !this.require_passphrase) {
			if (session.token_hash == null) {
				let token = this.generateToken(6);
				let subject = this.processEmailTemplateString(this.waiting_for_authenticate_token_email_template[language].subject, {
					token
				});
				let message = this.processEmailTemplateString(this.waiting_for_authenticate_token_email_template[language].message, {
					token
				});
				await this.sendEmail(session.email, subject, message);
				return {
					...session,
					token_hash: this.computeHash(token),
					type: "WAITING_FOR_AUTHENTICATE_TOKEN",
					reason: "AUTHENTICATE_TOKEN_REQUIRED",
					expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
					wait_until_utc: this.getExpiresInMilliseconds(250)
				};
			}
		}
		if (this.require_passphrase) {
			if (session.passdata == null) {
				return {
					...session,
					passdata: user.passdata,
					type: "WAITING_FOR_AUTHENTICATE_PASSPHRASE",
					reason: "AUTHENTICATE_PASSPHRASE_REQUIRED",
					expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
					wait_until_utc: this.getExpiresInMilliseconds(250)
				};
			}
		}
		return {
			id: session.id,
			authenticated_user_id: user.id,
			type: "AUTHENTICATED",
			reason: "AUTHENTICATION_COMPLETED",
			expires_utc: this.getExpiresInDays(this.authenticated_session_validity_days),
			wait_until_utc: this.getExpiresInMilliseconds(250)
		};
	}

	protected async getNextRecoverSession(session: Session, request: autoguard.api.ClientRequest<autoguard.api.EndpointRequest>): Promise<Session> {
		let language = this.getUserLanguage(request);
		if (session.username != null) {
			let users = await this.users.lookupObjects("username", "=", session.username);
			if (users.length === 0) {
				let username_attempts = (session.username_attempts ?? 0) + 1;
				return {
					...session,
					username_attempts: username_attempts,
					type: "WAITING_FOR_RECOVER_USERNAME",
					reason: "RECOVER_USERNAME_NOT_AVAILABLE",
					expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
					wait_until_utc: this.getExpiresInMilliseconds(250 * 2 ** Math.max(0, username_attempts - this.tolerable_username_attempts))
				};
			}
		}
		if (session.email == null) {
			return {
				...session,
				type: "WAITING_FOR_RECOVER_EMAIL",
				reason: "RECOVER_EMAIL_REQUIRED",
				expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
				wait_until_utc: this.getExpiresInMilliseconds(250)
			};
		}
		let users = await this.users.lookupObjects("email", "=", session.email);
		if (users.length === 0) {
			let email_attempts = (session.email_attempts ?? 0) + 1;
			return {
				...session,
				token_hash: undefined,
				token_hash_attempts: undefined,
				email_attempts: email_attempts,
				type: "WAITING_FOR_RECOVER_EMAIL",
				reason: "RECOVER_EMAIL_NOT_AVAILABLE",
				expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
				wait_until_utc: this.getExpiresInMilliseconds(250 * 2 ** Math.max(0, email_attempts - this.tolerable_email_attempts))
			};
		}
		let user = users.pop();
		if (user == null) {
			throw new ExpectedUnreachableCodeError();
		}
		if (session.token_hash == null) {
			let token = this.generateToken(15);
				let subject = this.processEmailTemplateString(this.waiting_for_recover_token_email_template[language].subject, {
					token
				});
				let message = this.processEmailTemplateString(this.waiting_for_recover_token_email_template[language].message, {
					token
				});
				await this.sendEmail(session.email, subject, message);
			return {
				...session,
				token_hash: this.computeHash(token),
				type: "WAITING_FOR_RECOVER_TOKEN",
				reason: "RECOVER_TOKEN_REQUIRED",
				expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
				wait_until_utc: this.getExpiresInMilliseconds(250)
			};
		}
		if (this.require_passphrase) {
			if (session.passdata == null) {
				return {
					...session,
					type: "WAITING_FOR_RECOVER_PASSPHRASE",
					reason: "RECOVER_PASSPHRASE_REQUIRED",
					expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
					wait_until_utc: this.getExpiresInMilliseconds(250)
				};
			} else {
				await this.users.updateObject({
					...user,
					passdata: session.passdata
				});
			}
		}
		return {
			id: session.id,
			authenticated_user_id: user.id,
			type: "AUTHENTICATED",
			reason: "RECOVERY_COMPLETED",
			expires_utc: this.getExpiresInDays(this.authenticated_session_validity_days),
			wait_until_utc: this.getExpiresInMilliseconds(250)
		};
	}

	protected async getNextSession(session: Session, command: Command, request: autoguard.api.ClientRequest<autoguard.api.EndpointRequest>): Promise<Session> {
		if (api.ResetStateCommand.is(command)) {
			return {
				id: session.id,
				type: "WAITING_FOR_COMMAND",
				reason: "COMMAND_REQUIRED",
				expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
				wait_until_utc: this.getExpiresInMilliseconds(250)
			};
		}
		if (session.expires_utc <= Date.now()) {
			return {
				id: session.id,
				type: "WAITING_FOR_COMMAND",
				reason: "SESSION_EXPIRED",
				expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
				wait_until_utc: this.getExpiresInMilliseconds(250)
			};
		}
		if (api.WaitingForCommandState.is(session)) {
			if (api.RegisterCommand.is(command)) {
				return this.getNextRegisterSession(session, request);
			}
			if (api.AuthenticateCommand.is(command)) {
				return this.getNextAuthenticateSession(session, request);
			}
			if (api.RecoverCommand.is(command)) {
				return this.getNextRecoverSession(session, request);
			}
		} else if (api.WaitingForRegisterUsernameState.is(session)) {
			if (api.RegisterUsernameCommand.is(command)) {
				if (!this.validateUsernameFormat(command.username)) {
					return {
						...session,
						type: "WAITING_FOR_REGISTER_USERNAME",
						reason: "REGISTER_USERNAME_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
						wait_until_utc: this.getExpiresInMilliseconds(250)
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
						reason: "REGISTER_EMAIL_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
						wait_until_utc: this.getExpiresInMilliseconds(250)
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
						reason: "REGISTER_TOKEN_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
						wait_until_utc: this.getExpiresInMilliseconds(250 * 2 ** Math.max(0, token_hash_attempts - this.tolerable_token_hash_attempts))
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
						reason: "REGISTER_PASSPHRASE_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
						wait_until_utc: this.getExpiresInMilliseconds(250)
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
						reason: "AUTHENTICATE_USERNAME_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
						wait_until_utc: this.getExpiresInMilliseconds(250)
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
						reason: "AUTHENTICATE_EMAIL_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
						wait_until_utc: this.getExpiresInMilliseconds(250)
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
						reason: "AUTHENTICATE_TOKEN_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
						wait_until_utc: this.getExpiresInMilliseconds(250 * 2 ** Math.max(0, token_hash_attempts - this.tolerable_token_hash_attempts))
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
						reason: "AUTHENTICATE_PASSPHRASE_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
						wait_until_utc: this.getExpiresInMilliseconds(250 * 2 ** Math.max(0, passdata_attempts - this.tolerable_passdata_attempts))
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
						reason: "RECOVER_USERNAME_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
						wait_until_utc: this.getExpiresInMilliseconds(250)
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
						reason: "RECOVER_EMAIL_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
						wait_until_utc: this.getExpiresInMilliseconds(250)
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
						reason: "RECOVER_TOKEN_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
						wait_until_utc: this.getExpiresInMilliseconds(250 * 2 ** Math.max(0, token_hash_attempts - this.tolerable_token_hash_attempts))
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
						reason: "RECOVER_PASSPHRASE_NOT_ACCEPTED",
						expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
						wait_until_utc: this.getExpiresInMilliseconds(250)
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
			expires_utc: this.getExpiresInMinutes(this.session_validity_minutes),
			wait_until_utc: this.getExpiresInMilliseconds(250)
		};
	}

	protected processEmailTemplateString(template: string, variables: Record<string, string | undefined>): string {
		return template.replaceAll(/[{]([^}]*)[}]/g, (_, key) => {
			return variables[key] ?? "?";
		});
	}

	protected async sendEmail(to_address: string, subject: string, message: string): Promise<void> {
		await this.mailer.send({
			subject: subject,
			message: message,
			to_address: to_address
		});
	}

	protected validateEmailFormat(email: string): boolean {
		let bytes = Buffer.from(email, "utf-8").length;
		return /^([0-9a-z!#$%&'*+/=?^_`{|}~-]+(?:[\.][0-9a-z!#$%&'*+/=?^_`{|}~-]+)*)[@]([0-9a-z](?:[0-9a-z-]*[0-9a-z])?(?:[\.][0-9a-z](?:[0-9a-z-]*[0-9a-z])?)*)$/iu.test(email) && bytes < 256;
	}

	protected validatePassphraseFormat(passphrase: string): boolean {
		let bytes = Buffer.from(passphrase, "utf-8").length;
		return /^(.+)$/iu.test(passphrase) && bytes >= 8;
	}

	protected validateUsernameFormat(username: string): boolean {
		let bytes = Buffer.from(username, "utf-8").length;
		return /^([a-z0-9_]+)$/iu.test(username) && bytes < 32;
	}

	protected readState: Parameters<typeof api.makeServer>[0]["readState"] = async (request) => {
		try {
			let origin = await this.getOriginAndApplyRateLimit(request);
			let { session_id, ticket } = this.getCookieData(request) ?? {};
			let session = await this.getSession(session_id);
			this.checkRateLimit(session.wait_until_utc);
			let state = this.getApiState(session);
			let user = await this.getApiUser(session);
			return this.finalizeResponse({
				payload: {
					state,
					user
				},
				headers: {
					"x-wait-ms": Math.max(0, Math.max(origin.wait_until_utc, session.wait_until_utc) - Date.now())
				}
			}, session, ticket);
		} catch (error) {
			console.log(error);
			throw error;
		}
	};

	protected sendCommand: Parameters<typeof api.makeServer>[0]["sendCommand"] = async (request) => {
		try {
			let origin = await this.getOriginAndApplyRateLimit(request);
			let { session_id, ticket } = this.getCookieData(request) ?? {};
			let session = await this.getSession(session_id);
			this.checkRateLimit(session.wait_until_utc);
			let payload = await request.payload(1024);
			session = await this.getNextSession(session, payload.command, request);
			if (api.AuthenticatedState.is(session)) {
				ticket = this.generateTicket(32);
				session.ticket_hash = this.computeHash(ticket);
			} else {
				ticket = undefined;
				session.ticket_hash = undefined;
			}
			await this.sessions.updateObject(session);
			let state = this.getApiState(session);
			let user = await this.getApiUser(session);
			return this.finalizeResponse({
				payload: {
					state,
					user
				},
				headers: {
					"x-wait-ms": Math.max(0, Math.max(origin.wait_until_utc, session.wait_until_utc) - Date.now())
				}
			}, session, ticket);
		} catch (error) {
			console.log(error);
			throw error;
		}
	};

	constructor(options?: ServerOptions) {
		this.users = options?.users ?? new VolatileUserStore();
		this.sessions = options?.sessions ?? new VolatileSessionStore();
		this.origins = options?.origins ?? new VolatileOriginStore();
		this.roles = options?.roles ?? new VolatileRoleStore();
		this.user_roles = options?.user_roles ?? new VolatileUserRoleStore();
		this.cookie = options?.cookie ?? "session";
		this.trusted_proxies = options?.trusted_proxies?.slice() ?? [];
		this.session_validity_minutes = options?.session_validity_minutes ?? 20;
		this.authenticated_session_validity_days = options?.authenticated_session_validity_days ?? 14;
		this.origin_validity_minutes = options?.origin_validity_minutes ?? 60 * 24;
		this.mailer = options?.mailer ?? new TestMailer();
		this.require_username = options?.require_username ?? false;
		this.require_passphrase = options?.require_passphrase ?? false;
		this.require_token = options?.require_token ?? true;
		this.tolerable_username_attempts = options?.tolerable_username_attempts ?? 5;
		this.tolerable_email_attempts = options?.tolerable_email_attempts ?? 5;
		this.tolerable_token_hash_attempts = options?.tolerable_token_hash_attempts ?? 1;
		this.tolerable_passdata_attempts = options?.tolerable_passdata_attempts ?? 1;
		this.clean_expired_interval_minutes = options?.clean_expired_interval_minutes ?? 1;
		this.waiting_for_register_token_email_template = options?.waiting_for_register_token_email_template ?? WAITING_FOR_REGISTER_TOKEN_EMAIL_TEMPLATE;
		this.waiting_for_authenticate_token_email_template = options?.waiting_for_authenticate_token_email_template ?? WAITING_FOR_AUTHENTICATE_TOKEN_EMAIL_TEMPLATE;
		this.waiting_for_recover_token_email_template = options?.waiting_for_recover_token_email_template ?? WAITING_FOR_RECOVER_TOKEN_EMAIL_TEMPLATE;
		setInterval(async () => {
			let now = Date.now();
			let sessions = await this.sessions.lookupObjects("expires_utc", "<=", now);
			for (let session of sessions) {
				await this.sessions.deleteObject(session.id).catch(() => undefined);
			}
			let origins = await this.origins.lookupObjects("expires_utc", "<=", now);
			for (let origin of origins) {
				await this.origins.deleteObject(origin.id).catch(() => undefined);
			}
		}, this.clean_expired_interval_minutes * 1000 * 60);
	}

	wrapRoute<A extends autoguard.api.EndpointRequest, B extends autoguard.api.EndpointResponse>(route: AuthenticatedRoute<A, B>): AutoguardRoute<A, B> {
		return async (request) => {
			let { session_id, ticket } = this.getCookieData(request) ?? {};
			let session = await this.getSession(session_id);
			let authenticated_user_id = await this.getAuthenticatedUserId(session, ticket);
			let access_handler = await this.createAccessHandler(authenticated_user_id);
			let response = await route(request, access_handler);
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

	createRequestListener(options?: autoguard.api.ServerOptions): autoguard.api.RequestListener {
		return api.makeServer({
			readState: this.readState,
			sendCommand: this.sendCommand,
		}, options);
	}
};
