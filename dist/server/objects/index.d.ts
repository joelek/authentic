import * as autoguard from "@joelek/autoguard/dist/lib-shared";
import { State } from "../../api/server";
export declare const UserProperties: autoguard.serialization.MessageGuard<UserProperties>;
export type UserProperties = autoguard.guards.Object<{
    "created_utc": autoguard.guards.Integer;
    "email": autoguard.guards.String;
    "passdata": autoguard.guards.String;
}, {
    "username": autoguard.guards.Union<[
        autoguard.guards.String,
        autoguard.guards.Null
    ]>;
}>;
export declare const RoleProperties: autoguard.serialization.MessageGuard<RoleProperties>;
export type RoleProperties = autoguard.guards.Object<{
    "created_utc": autoguard.guards.Integer;
    "name": autoguard.guards.String;
}, {}>;
export declare const UserRoleProperties: autoguard.serialization.MessageGuard<UserRoleProperties>;
export type UserRoleProperties = autoguard.guards.Object<{
    "created_utc": autoguard.guards.Integer;
    "user_id": autoguard.guards.String;
    "role_id": autoguard.guards.String;
}, {}>;
export declare const SessionProperties: autoguard.serialization.MessageGuard<SessionProperties>;
export type SessionProperties = autoguard.guards.Intersection<[
    autoguard.guards.Object<{
        "created_utc": autoguard.guards.Integer;
        "type": autoguard.guards.String;
        "reason": autoguard.guards.String;
        "expires_utc": autoguard.guards.Integer;
        "wait_until_utc": autoguard.guards.Integer;
    }, {
        "username": autoguard.guards.Union<[
            autoguard.guards.String,
            autoguard.guards.Null
        ]>;
        "username_attempts": autoguard.guards.Union<[
            autoguard.guards.Integer,
            autoguard.guards.Null
        ]>;
        "email": autoguard.guards.Union<[
            autoguard.guards.String,
            autoguard.guards.Null
        ]>;
        "email_attempts": autoguard.guards.Union<[
            autoguard.guards.Integer,
            autoguard.guards.Null
        ]>;
        "code_hash": autoguard.guards.Union<[
            autoguard.guards.String,
            autoguard.guards.Null
        ]>;
        "code_hash_attempts": autoguard.guards.Union<[
            autoguard.guards.Integer,
            autoguard.guards.Null
        ]>;
        "passdata": autoguard.guards.Union<[
            autoguard.guards.String,
            autoguard.guards.Null
        ]>;
        "passdata_attempts": autoguard.guards.Union<[
            autoguard.guards.Integer,
            autoguard.guards.Null
        ]>;
        "authenticated_user_id": autoguard.guards.Union<[
            autoguard.guards.String,
            autoguard.guards.Null
        ]>;
        "ticket_hash": autoguard.guards.Union<[
            autoguard.guards.String,
            autoguard.guards.Null
        ]>;
    }>,
    autoguard.guards.Reference<State>
]>;
export declare const OriginProperties: autoguard.serialization.MessageGuard<OriginProperties>;
export type OriginProperties = autoguard.guards.Object<{
    "created_utc": autoguard.guards.Integer;
    "address": autoguard.guards.String;
    "expires_utc": autoguard.guards.Integer;
    "wait_until_utc": autoguard.guards.Integer;
}, {}>;
export declare namespace Autoguard {
    const Guards: {
        UserProperties: autoguard.guards.ReferenceGuard<{
            created_utc: number;
            email: string;
            passdata: string;
            username?: string | null | undefined;
        }>;
        RoleProperties: autoguard.guards.ReferenceGuard<{
            created_utc: number;
            name: string;
        }>;
        UserRoleProperties: autoguard.guards.ReferenceGuard<{
            created_utc: number;
            user_id: string;
            role_id: string;
        }>;
        SessionProperties: autoguard.guards.ReferenceGuard<SessionProperties>;
        OriginProperties: autoguard.guards.ReferenceGuard<{
            created_utc: number;
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
