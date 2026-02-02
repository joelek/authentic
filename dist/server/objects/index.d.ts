import * as autoguard from "@joelek/autoguard/dist/lib-shared";
import { State } from "../../api/server";
export declare const UserProperties: autoguard.serialization.MessageGuard<UserProperties>;
export type UserProperties = autoguard.guards.Object<{
    "created_utc": autoguard.guards.Integer;
    "updated_utc": autoguard.guards.Integer;
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
    "updated_utc": autoguard.guards.Integer;
    "name": autoguard.guards.String;
}, {}>;
export declare const UserRoleProperties: autoguard.serialization.MessageGuard<UserRoleProperties>;
export type UserRoleProperties = autoguard.guards.Object<{
    "created_utc": autoguard.guards.Integer;
    "updated_utc": autoguard.guards.Integer;
    "user_id": autoguard.guards.String;
    "role_id": autoguard.guards.String;
}, {}>;
export declare const SessionProperties: autoguard.serialization.MessageGuard<SessionProperties>;
export type SessionProperties = autoguard.guards.Intersection<[
    autoguard.guards.Object<{
        "created_utc": autoguard.guards.Integer;
        "updated_utc": autoguard.guards.Integer;
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
    "updated_utc": autoguard.guards.Integer;
    "address": autoguard.guards.String;
    "expires_utc": autoguard.guards.Integer;
    "wait_until_utc": autoguard.guards.Integer;
}, {}>;
export declare const JobStatus: autoguard.serialization.MessageGuard<JobStatus>;
export type JobStatus = autoguard.guards.Union<[
    autoguard.guards.StringLiteral<"ENQUEUED">,
    autoguard.guards.StringLiteral<"RUNNING">,
    autoguard.guards.StringLiteral<"SUCCESS">,
    autoguard.guards.StringLiteral<"FAILURE">,
    autoguard.guards.StringLiteral<"INVALID">
]>;
export declare const JobProperties: autoguard.serialization.MessageGuard<JobProperties>;
export type JobProperties = autoguard.guards.Object<{
    "created_utc": autoguard.guards.Integer;
    "updated_utc": autoguard.guards.Integer;
    "type": autoguard.guards.String;
    "status": autoguard.guards.Reference<JobStatus>;
}, {
    "options": autoguard.guards.Union<[
        autoguard.guards.String,
        autoguard.guards.Null
    ]>;
    "description": autoguard.guards.Union<[
        autoguard.guards.String,
        autoguard.guards.Null
    ]>;
    "started_utc": autoguard.guards.Union<[
        autoguard.guards.Integer,
        autoguard.guards.Null
    ]>;
    "ended_utc": autoguard.guards.Union<[
        autoguard.guards.Integer,
        autoguard.guards.Null
    ]>;
    "expires_utc": autoguard.guards.Union<[
        autoguard.guards.Integer,
        autoguard.guards.Null
    ]>;
}>;
export declare namespace Autoguard {
    const Guards: {
        UserProperties: autoguard.guards.ReferenceGuard<{
            created_utc: number;
            updated_utc: number;
            email: string;
            passdata: string;
            username?: string | null | undefined;
        }>;
        RoleProperties: autoguard.guards.ReferenceGuard<{
            created_utc: number;
            updated_utc: number;
            name: string;
        }>;
        UserRoleProperties: autoguard.guards.ReferenceGuard<{
            created_utc: number;
            updated_utc: number;
            user_id: string;
            role_id: string;
        }>;
        SessionProperties: autoguard.guards.ReferenceGuard<SessionProperties>;
        OriginProperties: autoguard.guards.ReferenceGuard<{
            created_utc: number;
            updated_utc: number;
            address: string;
            expires_utc: number;
            wait_until_utc: number;
        }>;
        JobStatus: autoguard.guards.ReferenceGuard<"ENQUEUED" | "RUNNING" | "SUCCESS" | "FAILURE" | "INVALID">;
        JobProperties: autoguard.guards.ReferenceGuard<{
            created_utc: number;
            updated_utc: number;
            type: string;
            status: "ENQUEUED" | "RUNNING" | "SUCCESS" | "FAILURE" | "INVALID";
            options?: string | null | undefined;
            description?: string | null | undefined;
            started_utc?: number | null | undefined;
            ended_utc?: number | null | undefined;
            expires_utc?: number | null | undefined;
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
