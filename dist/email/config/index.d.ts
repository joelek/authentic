import * as autoguard from "@joelek/autoguard/dist/lib-shared";
export declare const Attachment: autoguard.serialization.MessageGuard<Attachment>;
export type Attachment = autoguard.guards.Object<{
    "filename": autoguard.guards.String;
    "mime": autoguard.guards.String;
    "data": autoguard.guards.Binary;
}, {}>;
export declare const STMPTLSOption: autoguard.serialization.MessageGuard<STMPTLSOption>;
export type STMPTLSOption = autoguard.guards.Union<[
    autoguard.guards.StringLiteral<"IMPLICIT">,
    autoguard.guards.StringLiteral<"EXPLICIT">
]>;
export declare const Mailbox: autoguard.serialization.MessageGuard<Mailbox>;
export type Mailbox = autoguard.guards.Object<{
    "address": autoguard.guards.String;
}, {
    "name": autoguard.guards.String;
}>;
export declare const MailerOptions: autoguard.serialization.MessageGuard<MailerOptions>;
export type MailerOptions = autoguard.guards.Object<{
    "smtp": autoguard.guards.Object<{
        "hostname": autoguard.guards.String;
        "port": autoguard.guards.Number;
        "username": autoguard.guards.String;
        "password": autoguard.guards.String;
    }, {
        "timeout_seconds": autoguard.guards.Integer;
        "tls": autoguard.guards.Reference<STMPTLSOption>;
    }>;
}, {
    "defaults": autoguard.guards.Object<{}, {
        "sender": autoguard.guards.Reference<Mailbox>;
        "to": autoguard.guards.Union<[
            autoguard.guards.Reference<Mailbox>,
            autoguard.guards.Array<autoguard.guards.Reference<Mailbox>>
        ]>;
        "from": autoguard.guards.Union<[
            autoguard.guards.Reference<Mailbox>,
            autoguard.guards.Array<autoguard.guards.Reference<Mailbox>>
        ]>;
        "reply": autoguard.guards.Union<[
            autoguard.guards.Reference<Mailbox>,
            autoguard.guards.Array<autoguard.guards.Reference<Mailbox>>
        ]>;
        "cc": autoguard.guards.Union<[
            autoguard.guards.Reference<Mailbox>,
            autoguard.guards.Array<autoguard.guards.Reference<Mailbox>>
        ]>;
        "bcc": autoguard.guards.Union<[
            autoguard.guards.Reference<Mailbox>,
            autoguard.guards.Array<autoguard.guards.Reference<Mailbox>>
        ]>;
    }>;
}>;
export declare namespace Autoguard {
    const Guards: {
        Attachment: autoguard.guards.ReferenceGuard<{
            filename: string;
            mime: string;
            data: Uint8Array;
        }>;
        STMPTLSOption: autoguard.guards.ReferenceGuard<"IMPLICIT" | "EXPLICIT">;
        Mailbox: autoguard.guards.ReferenceGuard<{
            address: string;
            name?: string | undefined;
        }>;
        MailerOptions: autoguard.guards.ReferenceGuard<{
            smtp: {
                hostname: string;
                port: number;
                username: string;
                password: string;
                timeout_seconds?: number | undefined;
                tls?: "IMPLICIT" | "EXPLICIT" | undefined;
            };
            defaults?: {
                sender?: {
                    address: string;
                    name?: string | undefined;
                } | undefined;
                to?: {
                    address: string;
                    name?: string | undefined;
                } | autoguard.guards.Array<{
                    address: string;
                    name?: string | undefined;
                }> | undefined;
                from?: {
                    address: string;
                    name?: string | undefined;
                } | autoguard.guards.Array<{
                    address: string;
                    name?: string | undefined;
                }> | undefined;
                reply?: {
                    address: string;
                    name?: string | undefined;
                } | autoguard.guards.Array<{
                    address: string;
                    name?: string | undefined;
                }> | undefined;
                cc?: {
                    address: string;
                    name?: string | undefined;
                } | autoguard.guards.Array<{
                    address: string;
                    name?: string | undefined;
                }> | undefined;
                bcc?: {
                    address: string;
                    name?: string | undefined;
                } | autoguard.guards.Array<{
                    address: string;
                    name?: string | undefined;
                }> | undefined;
            } | undefined;
        }>;
    };
    type Guards = {
        [A in keyof typeof Guards]: ReturnType<typeof Guards[A]["as"]>;
    };
    const Requests: {};
    type Requests = {
        [A in keyof typeof Requests]: ReturnType<typeof Requests[A]["as"]>;
    };
    const Responses: {};
    type Responses = {
        [A in keyof typeof Responses]: ReturnType<typeof Responses[A]["as"]>;
    };
}
