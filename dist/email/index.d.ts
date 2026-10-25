/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import * as libnet from "net";
import * as libtls from "tls";
import { Attachment, Mailbox, MailerOptions, STMPTLSOption } from "./config";
export declare const IMPLICIT_TLS_PORT = 465;
export declare const EXPLICIT_TLS_PORT = 587;
export type State = "WAITING_FOR_GREETING" | "WAITING_FOR_EHLO_REPLY" | "WAITING_FOR_STARTTLS_REPLY" | "WAITING_FOR_AUTH_PLAIN_REPLY" | "WAITING_FOR_AUTH_LOGIN_REPLY" | "WAITING_FOR_MAIL_REPLY" | "WAITING_FOR_RCPT_REPLY" | "WAITING_FOR_DATA_REPLY" | "WAITING_FOR_FINALIZATION" | "FINISHED";
export declare function encode(string: string): string;
export declare function encodeMailbox(mailbox: Mailbox): string;
export declare function encodeMailboxes(mailboxes: Array<Mailbox>): string;
export declare function getUniqueMailboxes(mailboxes: Array<Mailbox>): Array<Mailbox>;
export declare function split(string: string, max_length: number): Array<string>;
export declare function performTLSHandshake(net_socket: libnet.Socket, servername: string, timeout_seconds: number): Promise<libtls.TLSSocket>;
export type SendOptions = MailerOptions["defaults"] & {
    subject: string;
    message: string;
    attachments?: Array<Attachment>;
    html?: boolean;
};
export type CompleteSendOptions = {
    [A in keyof SendOptions]-?: (undefined | Mailbox | Mailbox[]) extends SendOptions[A] ? Mailbox[] : SendOptions[A];
};
export interface Mailer {
    send(options: SendOptions): Promise<void>;
}
export declare class TestMailer implements Mailer {
    constructor();
    send(options: SendOptions): Promise<void>;
}
export declare function loadConfig(config: string): MailerOptions;
export declare class MissingToAddressError extends Error {
    constructor();
    get message(): string;
}
export declare class MissingFromAddressError extends Error {
    constructor();
    get message(): string;
}
export declare class ConnectionTimeoutError extends Error {
    protected timeout_seconds: number;
    constructor(timeout_seconds: number);
    get message(): string;
}
export declare class HandshakeTimeoutError extends Error {
    protected timeout_seconds: number;
    constructor(timeout_seconds: number);
    get message(): string;
}
export declare class UnexpectedResponseError extends Error {
    protected state: State;
    protected lines: Array<string>;
    constructor(state: State, lines: Array<string>);
    get message(): string;
}
export declare class UnexpectedStateError extends Error {
    protected state: State;
    constructor(state: State);
    get message(): string;
}
export declare class UnsupportedAuthenticationMethodError extends Error {
    protected methods: Array<string>;
    constructor(methods: Array<string>);
    get message(): string;
}
export type OnDataCallback = (data: Buffer) => void;
export declare class SMTPMailer implements Mailer {
    protected options: MailerOptions;
    protected generateMessageIDAddress(from_address: string): string;
    protected getMailboxes(value: Mailbox | Array<Mailbox> | undefined): Array<Mailbox>;
    protected getCompleteSendOptions(options: SendOptions): CompleteSendOptions;
    protected getTlsOption(): STMPTLSOption;
    protected getLoginMethods(lines: Array<string>): Array<string>;
    protected finishSending(options: CompleteSendOptions, tls_socket: libtls.TLSSocket, state: State): Promise<void>;
    protected sendExplicit(options: CompleteSendOptions): Promise<void>;
    protected sendImplicit(options: CompleteSendOptions): Promise<void>;
    constructor(options: MailerOptions);
    send(options: SendOptions): Promise<void>;
}
