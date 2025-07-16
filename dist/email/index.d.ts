import { Attachment, MailerOptions } from "./config";
export type State = "WAITING_FOR_GREETING" | "WAITING_FOR_EHLO_REPLY" | "WAITING_FOR_AUTH_REPLY" | "WAITING_FOR_MAIL_REPLY" | "WAITING_FOR_RCPT_REPLY" | "WAITING_FOR_DATA_REPLY" | "WAITING_FOR_FINALIZATION" | "FINISHED";
export declare function encode(string: string): string;
export declare function split(string: string, max_length: number): Array<string>;
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
    constructor(options: MailerOptions);
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
