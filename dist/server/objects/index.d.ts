import * as autoguard from "@joelek/autoguard/dist/lib-shared";
import { State } from "../../api/server";
export declare const UserProperties: autoguard.serialization.MessageGuard<UserProperties>;
export type UserProperties = autoguard.guards.Object<{
    "email": autoguard.guards.String;
    "passdata": autoguard.guards.String;
}, {
    "username": autoguard.guards.String;
}>;
export declare const RoleProperties: autoguard.serialization.MessageGuard<RoleProperties>;
export type RoleProperties = autoguard.guards.Object<{
    "user_id": autoguard.guards.String;
    "name": autoguard.guards.String;
}, {}>;
export declare const SessionProperties: autoguard.serialization.MessageGuard<SessionProperties>;
export type SessionProperties = autoguard.guards.Intersection<[
    autoguard.guards.Reference<State>,
    autoguard.guards.Object<{
        "expires_utc": autoguard.guards.Integer;
        "wait_until_utc": autoguard.guards.Integer;
    }, {
        "username": autoguard.guards.String;
        "username_attempts": autoguard.guards.Integer;
        "email": autoguard.guards.String;
        "email_attempts": autoguard.guards.Integer;
        "token_hash": autoguard.guards.String;
        "token_hash_attempts": autoguard.guards.Integer;
        "passdata": autoguard.guards.String;
        "passdata_attempts": autoguard.guards.Integer;
        "user_id": autoguard.guards.String;
        "ticket_hash": autoguard.guards.String;
    }>
]>;
export declare const OriginProperties: autoguard.serialization.MessageGuard<OriginProperties>;
export type OriginProperties = autoguard.guards.Object<{
    "address": autoguard.guards.String;
    "expires_utc": autoguard.guards.Integer;
    "wait_until_utc": autoguard.guards.Integer;
}, {}>;
export declare namespace Autoguard {
    const Guards: {
        UserProperties: autoguard.guards.ReferenceGuard<{
            email: string;
            passdata: string;
            username?: string | undefined;
        }>;
        RoleProperties: autoguard.guards.ReferenceGuard<{
            user_id: string;
            name: string;
        }>;
        SessionProperties: autoguard.guards.ReferenceGuard<SessionProperties>;
        OriginProperties: autoguard.guards.ReferenceGuard<{
            address: string;
            expires_utc: number;
            wait_until_utc: number;
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
