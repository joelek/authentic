/// <reference types="node" />
/// <reference types="node" />
import * as libnet from "net";
import * as libtls from "tls";
import { Attachment, MailerOptions, STMPTLSOption } from "./config";
export declare const IMPLICIT_TLS_PORT = 465;
export declare const EXPLICIT_TLS_PORT = 587;
export type State = "WAITING_FOR_GREETING" | "WAITING_FOR_EHLO_REPLY" | "WAITING_FOR_STARTTLS_REPLY" | "WAITING_FOR_AUTH_PLAIN_REPLY" | "WAITING_FOR_AUTH_LOGIN_REPLY" | "WAITING_FOR_MAIL_REPLY" | "WAITING_FOR_RCPT_REPLY" | "WAITING_FOR_DATA_REPLY" | "WAITING_FOR_FINALIZATION" | "FINISHED";
export declare function encode(string: string): string;
export declare function split(string: string, max_length: number): Array<string>;
export declare function performTLSHandshake(net_socket: libnet.Socket, servername: string): Promise<libtls.TLSSocket>;
export interface Mailer {
    send(options: {
        subject: string;
        message: string;
        to_address?: string;
        to_name?: string;
        from_address?: string;
        from_name?: string;
        reply_address?: string;
        reply_name?: string;
        attachments?: Array<Attachment>;
        html?: boolean;
    }): Promise<void>;
}
export declare class TestMailer implements Mailer {
    constructor();
    send(options: {
        subject: string;
        message: string;
        to_address?: string;
        to_name?: string;
        from_address?: string;
        from_name?: string;
        reply_address?: string;
        reply_name?: string;
        attachments?: Array<Attachment>;
        html?: boolean;
    }): Promise<void>;
}
export declare function loadConfig(config: string): MailerOptions;
export declare class MissingToAddressError extends Error {
    constructor();
    toString(): string;
}
export declare class MissingFromAddressError extends Error {
    constructor();
    toString(): string;
}
export declare class MissingReplyAddressError extends Error {
    constructor();
    toString(): string;
}
export type SendOptions = {
    subject: string;
    message: string;
    to_address?: string;
    to_name?: string;
    from_address?: string;
    from_name?: string;
    reply_address?: string;
    reply_name?: string;
    attachments?: Array<Attachment>;
    html?: boolean;
};
export declare class SMTPMailer implements Mailer {
    protected options: MailerOptions;
    protected generateMessageIDAddress(from_address: string): string;
    protected getTo(options: {
        to_address?: string;
        to_name?: string;
    }): {
        address: string;
        name?: string;
    };
    protected getFrom(options: {
        from_address?: string;
        from_name?: string;
    }): {
        address: string;
        name?: string;
    };
    protected getReply(options: {
        reply_address?: string;
        reply_name?: string;
    }): {
        address: string;
        name?: string;
    };
    protected getTlsOption(): STMPTLSOption;
    protected getLoginMethods(lines: Array<string>): Array<string>;
    protected finishSending(state: State, options: SendOptions, tls_socket: libtls.TLSSocket): Promise<void>;
    protected sendExplicit(options: SendOptions): Promise<void>;
    protected sendImplicit(options: SendOptions): Promise<void>;
    constructor(options: MailerOptions);
    send(options: SendOptions): Promise<void>;
}
