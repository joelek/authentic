import { MailerOptions } from "./config";
export type State = "WAITING_FOR_GREETING" | "WAITING_FOR_EHLO_REPLY" | "WAITING_FOR_AUTH_REPLY" | "WAITING_FOR_MAIL_REPLY" | "WAITING_FOR_RCPT_REPLY" | "WAITING_FOR_DATA_REPLY" | "WAITING_FOR_FINALIZATION" | "FINISHED";
export declare function encode(string: string): string;
export declare function split(string: string, max_length: number): Array<string>;
export interface Mailer {
    send(options: {
        from_address: string;
        to_address: string;
        reply_address: string;
        subject: string;
        message: string;
        from_name?: string;
        to_name?: string;
        reply_name?: string;
    }): Promise<void>;
}
export declare class TestMailer implements Mailer {
    constructor();
    send(options: {
        from_address: string;
        to_address: string;
        reply_address: string;
        subject: string;
        message: string;
        from_name?: string;
        to_name?: string;
        reply_name?: string;
    }): Promise<void>;
}
export declare function loadConfig(config: string): MailerOptions;
export declare class SMTPMailer implements Mailer {
    protected options: MailerOptions;
    constructor(options: MailerOptions);
    send(options: {
        from_address: string;
        to_address: string;
        reply_address: string;
        subject: string;
        message: string;
        from_name?: string;
        to_name?: string;
        reply_name?: string;
    }): Promise<void>;
}
