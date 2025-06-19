import * as autoguard from "@joelek/autoguard/dist/lib-shared";
export declare const MailerOptions: autoguard.serialization.MessageGuard<MailerOptions>;
export type MailerOptions = autoguard.guards.Object<{
    "smtp": autoguard.guards.Object<{
        "hostname": autoguard.guards.String;
        "port": autoguard.guards.Number;
        "username": autoguard.guards.String;
        "password": autoguard.guards.String;
    }, {}>;
}, {
    "defaults": autoguard.guards.Object<{}, {
        "to_address": autoguard.guards.String;
        "to_name": autoguard.guards.String;
        "from_address": autoguard.guards.String;
        "from_name": autoguard.guards.String;
        "reply_address": autoguard.guards.String;
        "reply_name": autoguard.guards.String;
    }>;
}>;
export declare namespace Autoguard {
    const Guards: {
        MailerOptions: autoguard.guards.ReferenceGuard<{
            smtp: {
                hostname: string;
                port: number;
                username: string;
                password: string;
            };
            defaults?: {
                to_address?: string | undefined;
                to_name?: string | undefined;
                from_address?: string | undefined;
                from_name?: string | undefined;
                reply_address?: string | undefined;
                reply_name?: string | undefined;
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
