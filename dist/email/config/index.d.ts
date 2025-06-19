import * as autoguard from "@joelek/autoguard/dist/lib-shared";
export declare const MailerOptions: autoguard.serialization.MessageGuard<MailerOptions>;
export type MailerOptions = autoguard.guards.Object<{
    "hostname": autoguard.guards.String;
    "port": autoguard.guards.Number;
    "username": autoguard.guards.String;
    "password": autoguard.guards.String;
}, {}>;
export declare namespace Autoguard {
    const Guards: {
        MailerOptions: autoguard.guards.ReferenceGuard<{
            hostname: string;
            port: number;
            username: string;
            password: string;
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
