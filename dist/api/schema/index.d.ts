import * as autoguard from "@joelek/autoguard/dist/lib-shared";
export declare const RegisterCommand: autoguard.serialization.MessageGuard<RegisterCommand>;
export type RegisterCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"REGISTER">;
}, {}>;
export declare const RegisterUsernameCommand: autoguard.serialization.MessageGuard<RegisterUsernameCommand>;
export type RegisterUsernameCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"REGISTER_USERNAME">;
    "username": autoguard.guards.String;
}, {}>;
export declare const RegisterEmailCommand: autoguard.serialization.MessageGuard<RegisterEmailCommand>;
export type RegisterEmailCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"REGISTER_EMAIL">;
    "email": autoguard.guards.String;
}, {}>;
export declare const RegisterTokenCommand: autoguard.serialization.MessageGuard<RegisterTokenCommand>;
export type RegisterTokenCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"REGISTER_TOKEN">;
    "token": autoguard.guards.String;
}, {}>;
export declare const RegisterPassphraseCommand: autoguard.serialization.MessageGuard<RegisterPassphraseCommand>;
export type RegisterPassphraseCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"REGISTER_PASSPHRASE">;
    "passphrase": autoguard.guards.String;
}, {}>;
export declare const RegisterCommands: autoguard.serialization.MessageGuard<RegisterCommands>;
export type RegisterCommands = autoguard.guards.Union<[
    autoguard.guards.Reference<RegisterCommand>,
    autoguard.guards.Reference<RegisterUsernameCommand>,
    autoguard.guards.Reference<RegisterEmailCommand>,
    autoguard.guards.Reference<RegisterTokenCommand>,
    autoguard.guards.Reference<RegisterPassphraseCommand>
]>;
export declare const WaitingForRegisterUsernameState: autoguard.serialization.MessageGuard<WaitingForRegisterUsernameState>;
export type WaitingForRegisterUsernameState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"WAITING_FOR_REGISTER_USERNAME">;
    "reason": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"REGISTER_USERNAME_REQUIRED">,
        autoguard.guards.StringLiteral<"REGISTER_USERNAME_NOT_ACCEPTED">,
        autoguard.guards.StringLiteral<"REGISTER_USERNAME_NOT_AVAILABLE">
    ]>;
}, {}>;
export declare const WaitingForRegisterEmailState: autoguard.serialization.MessageGuard<WaitingForRegisterEmailState>;
export type WaitingForRegisterEmailState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"WAITING_FOR_REGISTER_EMAIL">;
    "reason": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"REGISTER_EMAIL_REQUIRED">,
        autoguard.guards.StringLiteral<"REGISTER_EMAIL_NOT_ACCEPTED">,
        autoguard.guards.StringLiteral<"REGISTER_EMAIL_NOT_AVAILABLE">
    ]>;
}, {}>;
export declare const WaitingForRegisterTokenState: autoguard.serialization.MessageGuard<WaitingForRegisterTokenState>;
export type WaitingForRegisterTokenState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"WAITING_FOR_REGISTER_TOKEN">;
    "reason": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"REGISTER_TOKEN_REQUIRED">,
        autoguard.guards.StringLiteral<"REGISTER_TOKEN_NOT_ACCEPTED">
    ]>;
}, {}>;
export declare const WaitingForRegisterPassphraseState: autoguard.serialization.MessageGuard<WaitingForRegisterPassphraseState>;
export type WaitingForRegisterPassphraseState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"WAITING_FOR_REGISTER_PASSPHRASE">;
    "reason": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"REGISTER_PASSPHRASE_REQUIRED">,
        autoguard.guards.StringLiteral<"REGISTER_PASSPHRASE_NOT_ACCEPTED">
    ]>;
}, {}>;
export declare const RegisteredState: autoguard.serialization.MessageGuard<RegisteredState>;
export type RegisteredState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"REGISTERED">;
    "reason": autoguard.guards.StringLiteral<"REGISTRATION_COMPLETED">;
}, {}>;
export declare const RegisterStates: autoguard.serialization.MessageGuard<RegisterStates>;
export type RegisterStates = autoguard.guards.Union<[
    autoguard.guards.Reference<WaitingForRegisterUsernameState>,
    autoguard.guards.Reference<WaitingForRegisterEmailState>,
    autoguard.guards.Reference<WaitingForRegisterTokenState>,
    autoguard.guards.Reference<WaitingForRegisterPassphraseState>,
    autoguard.guards.Reference<RegisteredState>
]>;
export declare const AuthenticateCommand: autoguard.serialization.MessageGuard<AuthenticateCommand>;
export type AuthenticateCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"AUTHENTICATE">;
}, {}>;
export declare const AuthenticateUsernameCommand: autoguard.serialization.MessageGuard<AuthenticateUsernameCommand>;
export type AuthenticateUsernameCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"AUTHENTICATE_USERNAME">;
    "username": autoguard.guards.String;
}, {}>;
export declare const AuthenticateEmailCommand: autoguard.serialization.MessageGuard<AuthenticateEmailCommand>;
export type AuthenticateEmailCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"AUTHENTICATE_EMAIL">;
    "email": autoguard.guards.String;
}, {}>;
export declare const AuthenticateTokenCommand: autoguard.serialization.MessageGuard<AuthenticateTokenCommand>;
export type AuthenticateTokenCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"AUTHENTICATE_TOKEN">;
    "token": autoguard.guards.String;
}, {}>;
export declare const AuthenticatePassphraseCommand: autoguard.serialization.MessageGuard<AuthenticatePassphraseCommand>;
export type AuthenticatePassphraseCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"AUTHENTICATE_PASSPHRASE">;
    "passphrase": autoguard.guards.String;
}, {}>;
export declare const AuthenticateCommands: autoguard.serialization.MessageGuard<AuthenticateCommands>;
export type AuthenticateCommands = autoguard.guards.Union<[
    autoguard.guards.Reference<AuthenticateCommand>,
    autoguard.guards.Reference<AuthenticateUsernameCommand>,
    autoguard.guards.Reference<AuthenticateEmailCommand>,
    autoguard.guards.Reference<AuthenticateTokenCommand>,
    autoguard.guards.Reference<AuthenticatePassphraseCommand>
]>;
export declare const WaitingForAuthenticateUsernameState: autoguard.serialization.MessageGuard<WaitingForAuthenticateUsernameState>;
export type WaitingForAuthenticateUsernameState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"WAITING_FOR_AUTHENTICATE_USERNAME">;
    "reason": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"AUTHENTICATE_USERNAME_REQUIRED">,
        autoguard.guards.StringLiteral<"AUTHENTICATE_USERNAME_NOT_ACCEPTED">,
        autoguard.guards.StringLiteral<"AUTHENTICATE_USERNAME_NOT_AVAILABLE">
    ]>;
}, {}>;
export declare const WaitingForAuthenticateEmailState: autoguard.serialization.MessageGuard<WaitingForAuthenticateEmailState>;
export type WaitingForAuthenticateEmailState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"WAITING_FOR_AUTHENTICATE_EMAIL">;
    "reason": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"AUTHENTICATE_EMAIL_REQUIRED">,
        autoguard.guards.StringLiteral<"AUTHENTICATE_EMAIL_NOT_ACCEPTED">,
        autoguard.guards.StringLiteral<"AUTHENTICATE_EMAIL_NOT_AVAILABLE">
    ]>;
}, {}>;
export declare const WaitingForAuthenticateTokenState: autoguard.serialization.MessageGuard<WaitingForAuthenticateTokenState>;
export type WaitingForAuthenticateTokenState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"WAITING_FOR_AUTHENTICATE_TOKEN">;
    "reason": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"AUTHENTICATE_TOKEN_REQUIRED">,
        autoguard.guards.StringLiteral<"AUTHENTICATE_TOKEN_NOT_ACCEPTED">
    ]>;
}, {}>;
export declare const WaitingForAuthenticatePassphraseState: autoguard.serialization.MessageGuard<WaitingForAuthenticatePassphraseState>;
export type WaitingForAuthenticatePassphraseState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"WAITING_FOR_AUTHENTICATE_PASSPHRASE">;
    "reason": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"AUTHENTICATE_PASSPHRASE_REQUIRED">,
        autoguard.guards.StringLiteral<"AUTHENTICATE_PASSPHRASE_NOT_ACCEPTED">
    ]>;
}, {}>;
export declare const AuthenticatedState: autoguard.serialization.MessageGuard<AuthenticatedState>;
export type AuthenticatedState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"AUTHENTICATED">;
    "reason": autoguard.guards.StringLiteral<"AUTHENTICATION_COMPLETED">;
}, {}>;
export declare const AuthenticateStates: autoguard.serialization.MessageGuard<AuthenticateStates>;
export type AuthenticateStates = autoguard.guards.Union<[
    autoguard.guards.Reference<WaitingForAuthenticateUsernameState>,
    autoguard.guards.Reference<WaitingForAuthenticateEmailState>,
    autoguard.guards.Reference<WaitingForAuthenticateTokenState>,
    autoguard.guards.Reference<WaitingForAuthenticatePassphraseState>,
    autoguard.guards.Reference<AuthenticatedState>
]>;
export declare const RecoverCommand: autoguard.serialization.MessageGuard<RecoverCommand>;
export type RecoverCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"RECOVER">;
}, {}>;
export declare const RecoverUsernameCommand: autoguard.serialization.MessageGuard<RecoverUsernameCommand>;
export type RecoverUsernameCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"RECOVER_USERNAME">;
    "username": autoguard.guards.String;
}, {}>;
export declare const RecoverEmailCommand: autoguard.serialization.MessageGuard<RecoverEmailCommand>;
export type RecoverEmailCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"RECOVER_EMAIL">;
    "email": autoguard.guards.String;
}, {}>;
export declare const RecoverTokenCommand: autoguard.serialization.MessageGuard<RecoverTokenCommand>;
export type RecoverTokenCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"RECOVER_TOKEN">;
    "token": autoguard.guards.String;
}, {}>;
export declare const RecoverPassphraseCommand: autoguard.serialization.MessageGuard<RecoverPassphraseCommand>;
export type RecoverPassphraseCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"RECOVER_PASSPHRASE">;
    "passphrase": autoguard.guards.String;
}, {}>;
export declare const RecoverCommands: autoguard.serialization.MessageGuard<RecoverCommands>;
export type RecoverCommands = autoguard.guards.Union<[
    autoguard.guards.Reference<RecoverCommand>,
    autoguard.guards.Reference<RecoverUsernameCommand>,
    autoguard.guards.Reference<RecoverEmailCommand>,
    autoguard.guards.Reference<RecoverTokenCommand>,
    autoguard.guards.Reference<RecoverPassphraseCommand>
]>;
export declare const WaitingForRecoverUsernameState: autoguard.serialization.MessageGuard<WaitingForRecoverUsernameState>;
export type WaitingForRecoverUsernameState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"WAITING_FOR_RECOVER_USERNAME">;
    "reason": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"RECOVER_USERNAME_REQUIRED">,
        autoguard.guards.StringLiteral<"RECOVER_USERNAME_NOT_ACCEPTED">,
        autoguard.guards.StringLiteral<"RECOVER_USERNAME_NOT_AVAILABLE">
    ]>;
}, {}>;
export declare const WaitingForRecoverEmailState: autoguard.serialization.MessageGuard<WaitingForRecoverEmailState>;
export type WaitingForRecoverEmailState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"WAITING_FOR_RECOVER_EMAIL">;
    "reason": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"RECOVER_EMAIL_REQUIRED">,
        autoguard.guards.StringLiteral<"RECOVER_EMAIL_NOT_ACCEPTED">,
        autoguard.guards.StringLiteral<"RECOVER_EMAIL_NOT_AVAILABLE">
    ]>;
}, {}>;
export declare const WaitingForRecoverTokenState: autoguard.serialization.MessageGuard<WaitingForRecoverTokenState>;
export type WaitingForRecoverTokenState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"WAITING_FOR_RECOVER_TOKEN">;
    "reason": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"RECOVER_TOKEN_REQUIRED">,
        autoguard.guards.StringLiteral<"RECOVER_TOKEN_NOT_ACCEPTED">
    ]>;
}, {}>;
export declare const WaitingForRecoverPassphraseState: autoguard.serialization.MessageGuard<WaitingForRecoverPassphraseState>;
export type WaitingForRecoverPassphraseState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"WAITING_FOR_RECOVER_PASSPHRASE">;
    "reason": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"RECOVER_PASSPHRASE_REQUIRED">,
        autoguard.guards.StringLiteral<"RECOVER_PASSPHRASE_NOT_ACCEPTED">
    ]>;
}, {}>;
export declare const RecoveredState: autoguard.serialization.MessageGuard<RecoveredState>;
export type RecoveredState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"RECOVERED">;
    "reason": autoguard.guards.StringLiteral<"RECOVERY_COMPLETED">;
}, {}>;
export declare const RecoverStates: autoguard.serialization.MessageGuard<RecoverStates>;
export type RecoverStates = autoguard.guards.Union<[
    autoguard.guards.Reference<WaitingForRecoverUsernameState>,
    autoguard.guards.Reference<WaitingForRecoverEmailState>,
    autoguard.guards.Reference<WaitingForRecoverTokenState>,
    autoguard.guards.Reference<WaitingForRecoverPassphraseState>,
    autoguard.guards.Reference<RecoveredState>
]>;
export declare const ResetStateCommand: autoguard.serialization.MessageGuard<ResetStateCommand>;
export type ResetStateCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"RESET_STATE">;
}, {}>;
export declare const Command: autoguard.serialization.MessageGuard<Command>;
export type Command = autoguard.guards.Union<[
    autoguard.guards.Reference<ResetStateCommand>,
    autoguard.guards.Reference<RegisterCommands>,
    autoguard.guards.Reference<AuthenticateCommands>,
    autoguard.guards.Reference<RecoverCommands>
]>;
export declare const WaitingForCommandState: autoguard.serialization.MessageGuard<WaitingForCommandState>;
export type WaitingForCommandState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"WAITING_FOR_COMMAND">;
    "reason": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"COMMAND_REQUIRED">,
        autoguard.guards.StringLiteral<"SESSION_EXPIRED">,
        autoguard.guards.StringLiteral<"INVALID_COMMAND">
    ]>;
}, {}>;
export declare const State: autoguard.serialization.MessageGuard<State>;
export type State = autoguard.guards.Union<[
    autoguard.guards.Reference<WaitingForCommandState>,
    autoguard.guards.Reference<RegisterStates>,
    autoguard.guards.Reference<AuthenticateStates>,
    autoguard.guards.Reference<RecoverStates>
]>;
export declare namespace Autoguard {
    const Guards: {
        RegisterCommand: autoguard.guards.ReferenceGuard<{
            type: "REGISTER";
        }>;
        RegisterUsernameCommand: autoguard.guards.ReferenceGuard<{
            type: "REGISTER_USERNAME";
            username: string;
        }>;
        RegisterEmailCommand: autoguard.guards.ReferenceGuard<{
            type: "REGISTER_EMAIL";
            email: string;
        }>;
        RegisterTokenCommand: autoguard.guards.ReferenceGuard<{
            type: "REGISTER_TOKEN";
            token: string;
        }>;
        RegisterPassphraseCommand: autoguard.guards.ReferenceGuard<{
            type: "REGISTER_PASSPHRASE";
            passphrase: string;
        }>;
        RegisterCommands: autoguard.guards.ReferenceGuard<{
            type: "REGISTER";
        } | {
            type: "REGISTER_USERNAME";
            username: string;
        } | {
            type: "REGISTER_EMAIL";
            email: string;
        } | {
            type: "REGISTER_TOKEN";
            token: string;
        } | {
            type: "REGISTER_PASSPHRASE";
            passphrase: string;
        }>;
        WaitingForRegisterUsernameState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_REGISTER_USERNAME";
            reason: "REGISTER_USERNAME_REQUIRED" | "REGISTER_USERNAME_NOT_ACCEPTED" | "REGISTER_USERNAME_NOT_AVAILABLE";
        }>;
        WaitingForRegisterEmailState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_REGISTER_EMAIL";
            reason: "REGISTER_EMAIL_REQUIRED" | "REGISTER_EMAIL_NOT_ACCEPTED" | "REGISTER_EMAIL_NOT_AVAILABLE";
        }>;
        WaitingForRegisterTokenState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_REGISTER_TOKEN";
            reason: "REGISTER_TOKEN_REQUIRED" | "REGISTER_TOKEN_NOT_ACCEPTED";
        }>;
        WaitingForRegisterPassphraseState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_REGISTER_PASSPHRASE";
            reason: "REGISTER_PASSPHRASE_REQUIRED" | "REGISTER_PASSPHRASE_NOT_ACCEPTED";
        }>;
        RegisteredState: autoguard.guards.ReferenceGuard<{
            type: "REGISTERED";
            reason: "REGISTRATION_COMPLETED";
        }>;
        RegisterStates: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_REGISTER_USERNAME";
            reason: "REGISTER_USERNAME_REQUIRED" | "REGISTER_USERNAME_NOT_ACCEPTED" | "REGISTER_USERNAME_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_REGISTER_EMAIL";
            reason: "REGISTER_EMAIL_REQUIRED" | "REGISTER_EMAIL_NOT_ACCEPTED" | "REGISTER_EMAIL_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_REGISTER_TOKEN";
            reason: "REGISTER_TOKEN_REQUIRED" | "REGISTER_TOKEN_NOT_ACCEPTED";
        } | {
            type: "WAITING_FOR_REGISTER_PASSPHRASE";
            reason: "REGISTER_PASSPHRASE_REQUIRED" | "REGISTER_PASSPHRASE_NOT_ACCEPTED";
        } | {
            type: "REGISTERED";
            reason: "REGISTRATION_COMPLETED";
        }>;
        AuthenticateCommand: autoguard.guards.ReferenceGuard<{
            type: "AUTHENTICATE";
        }>;
        AuthenticateUsernameCommand: autoguard.guards.ReferenceGuard<{
            type: "AUTHENTICATE_USERNAME";
            username: string;
        }>;
        AuthenticateEmailCommand: autoguard.guards.ReferenceGuard<{
            type: "AUTHENTICATE_EMAIL";
            email: string;
        }>;
        AuthenticateTokenCommand: autoguard.guards.ReferenceGuard<{
            type: "AUTHENTICATE_TOKEN";
            token: string;
        }>;
        AuthenticatePassphraseCommand: autoguard.guards.ReferenceGuard<{
            type: "AUTHENTICATE_PASSPHRASE";
            passphrase: string;
        }>;
        AuthenticateCommands: autoguard.guards.ReferenceGuard<{
            type: "AUTHENTICATE";
        } | {
            type: "AUTHENTICATE_USERNAME";
            username: string;
        } | {
            type: "AUTHENTICATE_EMAIL";
            email: string;
        } | {
            type: "AUTHENTICATE_TOKEN";
            token: string;
        } | {
            type: "AUTHENTICATE_PASSPHRASE";
            passphrase: string;
        }>;
        WaitingForAuthenticateUsernameState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_AUTHENTICATE_USERNAME";
            reason: "AUTHENTICATE_USERNAME_REQUIRED" | "AUTHENTICATE_USERNAME_NOT_ACCEPTED" | "AUTHENTICATE_USERNAME_NOT_AVAILABLE";
        }>;
        WaitingForAuthenticateEmailState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_AUTHENTICATE_EMAIL";
            reason: "AUTHENTICATE_EMAIL_REQUIRED" | "AUTHENTICATE_EMAIL_NOT_ACCEPTED" | "AUTHENTICATE_EMAIL_NOT_AVAILABLE";
        }>;
        WaitingForAuthenticateTokenState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_AUTHENTICATE_TOKEN";
            reason: "AUTHENTICATE_TOKEN_REQUIRED" | "AUTHENTICATE_TOKEN_NOT_ACCEPTED";
        }>;
        WaitingForAuthenticatePassphraseState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_AUTHENTICATE_PASSPHRASE";
            reason: "AUTHENTICATE_PASSPHRASE_REQUIRED" | "AUTHENTICATE_PASSPHRASE_NOT_ACCEPTED";
        }>;
        AuthenticatedState: autoguard.guards.ReferenceGuard<{
            type: "AUTHENTICATED";
            reason: "AUTHENTICATION_COMPLETED";
        }>;
        AuthenticateStates: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_AUTHENTICATE_USERNAME";
            reason: "AUTHENTICATE_USERNAME_REQUIRED" | "AUTHENTICATE_USERNAME_NOT_ACCEPTED" | "AUTHENTICATE_USERNAME_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_AUTHENTICATE_EMAIL";
            reason: "AUTHENTICATE_EMAIL_REQUIRED" | "AUTHENTICATE_EMAIL_NOT_ACCEPTED" | "AUTHENTICATE_EMAIL_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_AUTHENTICATE_TOKEN";
            reason: "AUTHENTICATE_TOKEN_REQUIRED" | "AUTHENTICATE_TOKEN_NOT_ACCEPTED";
        } | {
            type: "WAITING_FOR_AUTHENTICATE_PASSPHRASE";
            reason: "AUTHENTICATE_PASSPHRASE_REQUIRED" | "AUTHENTICATE_PASSPHRASE_NOT_ACCEPTED";
        } | {
            type: "AUTHENTICATED";
            reason: "AUTHENTICATION_COMPLETED";
        }>;
        RecoverCommand: autoguard.guards.ReferenceGuard<{
            type: "RECOVER";
        }>;
        RecoverUsernameCommand: autoguard.guards.ReferenceGuard<{
            type: "RECOVER_USERNAME";
            username: string;
        }>;
        RecoverEmailCommand: autoguard.guards.ReferenceGuard<{
            type: "RECOVER_EMAIL";
            email: string;
        }>;
        RecoverTokenCommand: autoguard.guards.ReferenceGuard<{
            type: "RECOVER_TOKEN";
            token: string;
        }>;
        RecoverPassphraseCommand: autoguard.guards.ReferenceGuard<{
            type: "RECOVER_PASSPHRASE";
            passphrase: string;
        }>;
        RecoverCommands: autoguard.guards.ReferenceGuard<{
            type: "RECOVER";
        } | {
            type: "RECOVER_USERNAME";
            username: string;
        } | {
            type: "RECOVER_EMAIL";
            email: string;
        } | {
            type: "RECOVER_TOKEN";
            token: string;
        } | {
            type: "RECOVER_PASSPHRASE";
            passphrase: string;
        }>;
        WaitingForRecoverUsernameState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_RECOVER_USERNAME";
            reason: "RECOVER_USERNAME_REQUIRED" | "RECOVER_USERNAME_NOT_ACCEPTED" | "RECOVER_USERNAME_NOT_AVAILABLE";
        }>;
        WaitingForRecoverEmailState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_RECOVER_EMAIL";
            reason: "RECOVER_EMAIL_REQUIRED" | "RECOVER_EMAIL_NOT_ACCEPTED" | "RECOVER_EMAIL_NOT_AVAILABLE";
        }>;
        WaitingForRecoverTokenState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_RECOVER_TOKEN";
            reason: "RECOVER_TOKEN_REQUIRED" | "RECOVER_TOKEN_NOT_ACCEPTED";
        }>;
        WaitingForRecoverPassphraseState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_RECOVER_PASSPHRASE";
            reason: "RECOVER_PASSPHRASE_REQUIRED" | "RECOVER_PASSPHRASE_NOT_ACCEPTED";
        }>;
        RecoveredState: autoguard.guards.ReferenceGuard<{
            type: "RECOVERED";
            reason: "RECOVERY_COMPLETED";
        }>;
        RecoverStates: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_RECOVER_USERNAME";
            reason: "RECOVER_USERNAME_REQUIRED" | "RECOVER_USERNAME_NOT_ACCEPTED" | "RECOVER_USERNAME_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_RECOVER_EMAIL";
            reason: "RECOVER_EMAIL_REQUIRED" | "RECOVER_EMAIL_NOT_ACCEPTED" | "RECOVER_EMAIL_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_RECOVER_TOKEN";
            reason: "RECOVER_TOKEN_REQUIRED" | "RECOVER_TOKEN_NOT_ACCEPTED";
        } | {
            type: "WAITING_FOR_RECOVER_PASSPHRASE";
            reason: "RECOVER_PASSPHRASE_REQUIRED" | "RECOVER_PASSPHRASE_NOT_ACCEPTED";
        } | {
            type: "RECOVERED";
            reason: "RECOVERY_COMPLETED";
        }>;
        ResetStateCommand: autoguard.guards.ReferenceGuard<{
            type: "RESET_STATE";
        }>;
        Command: autoguard.guards.ReferenceGuard<{
            type: "REGISTER";
        } | {
            type: "REGISTER_USERNAME";
            username: string;
        } | {
            type: "REGISTER_EMAIL";
            email: string;
        } | {
            type: "REGISTER_TOKEN";
            token: string;
        } | {
            type: "REGISTER_PASSPHRASE";
            passphrase: string;
        } | {
            type: "AUTHENTICATE";
        } | {
            type: "AUTHENTICATE_USERNAME";
            username: string;
        } | {
            type: "AUTHENTICATE_EMAIL";
            email: string;
        } | {
            type: "AUTHENTICATE_TOKEN";
            token: string;
        } | {
            type: "AUTHENTICATE_PASSPHRASE";
            passphrase: string;
        } | {
            type: "RECOVER";
        } | {
            type: "RECOVER_USERNAME";
            username: string;
        } | {
            type: "RECOVER_EMAIL";
            email: string;
        } | {
            type: "RECOVER_TOKEN";
            token: string;
        } | {
            type: "RECOVER_PASSPHRASE";
            passphrase: string;
        } | {
            type: "RESET_STATE";
        }>;
        WaitingForCommandState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_COMMAND";
            reason: "COMMAND_REQUIRED" | "SESSION_EXPIRED" | "INVALID_COMMAND";
        }>;
        State: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_REGISTER_USERNAME";
            reason: "REGISTER_USERNAME_REQUIRED" | "REGISTER_USERNAME_NOT_ACCEPTED" | "REGISTER_USERNAME_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_REGISTER_EMAIL";
            reason: "REGISTER_EMAIL_REQUIRED" | "REGISTER_EMAIL_NOT_ACCEPTED" | "REGISTER_EMAIL_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_REGISTER_TOKEN";
            reason: "REGISTER_TOKEN_REQUIRED" | "REGISTER_TOKEN_NOT_ACCEPTED";
        } | {
            type: "WAITING_FOR_REGISTER_PASSPHRASE";
            reason: "REGISTER_PASSPHRASE_REQUIRED" | "REGISTER_PASSPHRASE_NOT_ACCEPTED";
        } | {
            type: "REGISTERED";
            reason: "REGISTRATION_COMPLETED";
        } | {
            type: "WAITING_FOR_AUTHENTICATE_USERNAME";
            reason: "AUTHENTICATE_USERNAME_REQUIRED" | "AUTHENTICATE_USERNAME_NOT_ACCEPTED" | "AUTHENTICATE_USERNAME_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_AUTHENTICATE_EMAIL";
            reason: "AUTHENTICATE_EMAIL_REQUIRED" | "AUTHENTICATE_EMAIL_NOT_ACCEPTED" | "AUTHENTICATE_EMAIL_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_AUTHENTICATE_TOKEN";
            reason: "AUTHENTICATE_TOKEN_REQUIRED" | "AUTHENTICATE_TOKEN_NOT_ACCEPTED";
        } | {
            type: "WAITING_FOR_AUTHENTICATE_PASSPHRASE";
            reason: "AUTHENTICATE_PASSPHRASE_REQUIRED" | "AUTHENTICATE_PASSPHRASE_NOT_ACCEPTED";
        } | {
            type: "AUTHENTICATED";
            reason: "AUTHENTICATION_COMPLETED";
        } | {
            type: "WAITING_FOR_RECOVER_USERNAME";
            reason: "RECOVER_USERNAME_REQUIRED" | "RECOVER_USERNAME_NOT_ACCEPTED" | "RECOVER_USERNAME_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_RECOVER_EMAIL";
            reason: "RECOVER_EMAIL_REQUIRED" | "RECOVER_EMAIL_NOT_ACCEPTED" | "RECOVER_EMAIL_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_RECOVER_TOKEN";
            reason: "RECOVER_TOKEN_REQUIRED" | "RECOVER_TOKEN_NOT_ACCEPTED";
        } | {
            type: "WAITING_FOR_RECOVER_PASSPHRASE";
            reason: "RECOVER_PASSPHRASE_REQUIRED" | "RECOVER_PASSPHRASE_NOT_ACCEPTED";
        } | {
            type: "RECOVERED";
            reason: "RECOVERY_COMPLETED";
        } | {
            type: "WAITING_FOR_COMMAND";
            reason: "COMMAND_REQUIRED" | "SESSION_EXPIRED" | "INVALID_COMMAND";
        }>;
    };
    type Guards = {
        [A in keyof typeof Guards]: ReturnType<typeof Guards[A]["as"]>;
    };
    const Requests: {
        readState: autoguard.guards.ObjectGuard<import("@joelek/stdlib/dist/lib/routing").MessageMap<unknown>, {
            options: {
                [x: string]: autoguard.api.JSON;
            };
            headers: {
                [x: string]: autoguard.api.JSON;
            };
            payload: autoguard.api.AsyncBinary | autoguard.api.SyncBinary;
        }>;
        sendCommand: autoguard.guards.ObjectGuard<{
            payload: {
                command: {
                    type: "REGISTER";
                } | {
                    type: "REGISTER_USERNAME";
                    username: string;
                } | {
                    type: "REGISTER_EMAIL";
                    email: string;
                } | {
                    type: "REGISTER_TOKEN";
                    token: string;
                } | {
                    type: "REGISTER_PASSPHRASE";
                    passphrase: string;
                } | {
                    type: "AUTHENTICATE";
                } | {
                    type: "AUTHENTICATE_USERNAME";
                    username: string;
                } | {
                    type: "AUTHENTICATE_EMAIL";
                    email: string;
                } | {
                    type: "AUTHENTICATE_TOKEN";
                    token: string;
                } | {
                    type: "AUTHENTICATE_PASSPHRASE";
                    passphrase: string;
                } | {
                    type: "RECOVER";
                } | {
                    type: "RECOVER_USERNAME";
                    username: string;
                } | {
                    type: "RECOVER_EMAIL";
                    email: string;
                } | {
                    type: "RECOVER_TOKEN";
                    token: string;
                } | {
                    type: "RECOVER_PASSPHRASE";
                    passphrase: string;
                } | {
                    type: "RESET_STATE";
                };
            };
        }, {
            options: {
                [x: string]: autoguard.api.JSON;
            };
            headers: {
                [x: string]: autoguard.api.JSON;
            };
        }>;
    };
    type Requests = {
        [A in keyof typeof Requests]: ReturnType<typeof Requests[A]["as"]>;
    };
    const Responses: {
        readState: autoguard.guards.ObjectGuard<{
            headers: {
                [x: string]: autoguard.api.JSON;
                "x-wait-ms": number;
            };
            payload: {
                state: {
                    type: "WAITING_FOR_REGISTER_USERNAME";
                    reason: "REGISTER_USERNAME_REQUIRED" | "REGISTER_USERNAME_NOT_ACCEPTED" | "REGISTER_USERNAME_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_REGISTER_EMAIL";
                    reason: "REGISTER_EMAIL_REQUIRED" | "REGISTER_EMAIL_NOT_ACCEPTED" | "REGISTER_EMAIL_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_REGISTER_TOKEN";
                    reason: "REGISTER_TOKEN_REQUIRED" | "REGISTER_TOKEN_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_REGISTER_PASSPHRASE";
                    reason: "REGISTER_PASSPHRASE_REQUIRED" | "REGISTER_PASSPHRASE_NOT_ACCEPTED";
                } | {
                    type: "REGISTERED";
                    reason: "REGISTRATION_COMPLETED";
                } | {
                    type: "WAITING_FOR_AUTHENTICATE_USERNAME";
                    reason: "AUTHENTICATE_USERNAME_REQUIRED" | "AUTHENTICATE_USERNAME_NOT_ACCEPTED" | "AUTHENTICATE_USERNAME_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_AUTHENTICATE_EMAIL";
                    reason: "AUTHENTICATE_EMAIL_REQUIRED" | "AUTHENTICATE_EMAIL_NOT_ACCEPTED" | "AUTHENTICATE_EMAIL_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_AUTHENTICATE_TOKEN";
                    reason: "AUTHENTICATE_TOKEN_REQUIRED" | "AUTHENTICATE_TOKEN_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_AUTHENTICATE_PASSPHRASE";
                    reason: "AUTHENTICATE_PASSPHRASE_REQUIRED" | "AUTHENTICATE_PASSPHRASE_NOT_ACCEPTED";
                } | {
                    type: "AUTHENTICATED";
                    reason: "AUTHENTICATION_COMPLETED";
                } | {
                    type: "WAITING_FOR_RECOVER_USERNAME";
                    reason: "RECOVER_USERNAME_REQUIRED" | "RECOVER_USERNAME_NOT_ACCEPTED" | "RECOVER_USERNAME_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_RECOVER_EMAIL";
                    reason: "RECOVER_EMAIL_REQUIRED" | "RECOVER_EMAIL_NOT_ACCEPTED" | "RECOVER_EMAIL_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_RECOVER_TOKEN";
                    reason: "RECOVER_TOKEN_REQUIRED" | "RECOVER_TOKEN_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_RECOVER_PASSPHRASE";
                    reason: "RECOVER_PASSPHRASE_REQUIRED" | "RECOVER_PASSPHRASE_NOT_ACCEPTED";
                } | {
                    type: "RECOVERED";
                    reason: "RECOVERY_COMPLETED";
                } | {
                    type: "WAITING_FOR_COMMAND";
                    reason: "COMMAND_REQUIRED" | "SESSION_EXPIRED" | "INVALID_COMMAND";
                };
            };
        }, {
            status: number;
        }>;
        sendCommand: autoguard.guards.ObjectGuard<{
            headers: {
                [x: string]: autoguard.api.JSON;
                "x-wait-ms": number;
            };
            payload: {
                state: {
                    type: "WAITING_FOR_REGISTER_USERNAME";
                    reason: "REGISTER_USERNAME_REQUIRED" | "REGISTER_USERNAME_NOT_ACCEPTED" | "REGISTER_USERNAME_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_REGISTER_EMAIL";
                    reason: "REGISTER_EMAIL_REQUIRED" | "REGISTER_EMAIL_NOT_ACCEPTED" | "REGISTER_EMAIL_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_REGISTER_TOKEN";
                    reason: "REGISTER_TOKEN_REQUIRED" | "REGISTER_TOKEN_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_REGISTER_PASSPHRASE";
                    reason: "REGISTER_PASSPHRASE_REQUIRED" | "REGISTER_PASSPHRASE_NOT_ACCEPTED";
                } | {
                    type: "REGISTERED";
                    reason: "REGISTRATION_COMPLETED";
                } | {
                    type: "WAITING_FOR_AUTHENTICATE_USERNAME";
                    reason: "AUTHENTICATE_USERNAME_REQUIRED" | "AUTHENTICATE_USERNAME_NOT_ACCEPTED" | "AUTHENTICATE_USERNAME_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_AUTHENTICATE_EMAIL";
                    reason: "AUTHENTICATE_EMAIL_REQUIRED" | "AUTHENTICATE_EMAIL_NOT_ACCEPTED" | "AUTHENTICATE_EMAIL_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_AUTHENTICATE_TOKEN";
                    reason: "AUTHENTICATE_TOKEN_REQUIRED" | "AUTHENTICATE_TOKEN_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_AUTHENTICATE_PASSPHRASE";
                    reason: "AUTHENTICATE_PASSPHRASE_REQUIRED" | "AUTHENTICATE_PASSPHRASE_NOT_ACCEPTED";
                } | {
                    type: "AUTHENTICATED";
                    reason: "AUTHENTICATION_COMPLETED";
                } | {
                    type: "WAITING_FOR_RECOVER_USERNAME";
                    reason: "RECOVER_USERNAME_REQUIRED" | "RECOVER_USERNAME_NOT_ACCEPTED" | "RECOVER_USERNAME_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_RECOVER_EMAIL";
                    reason: "RECOVER_EMAIL_REQUIRED" | "RECOVER_EMAIL_NOT_ACCEPTED" | "RECOVER_EMAIL_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_RECOVER_TOKEN";
                    reason: "RECOVER_TOKEN_REQUIRED" | "RECOVER_TOKEN_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_RECOVER_PASSPHRASE";
                    reason: "RECOVER_PASSPHRASE_REQUIRED" | "RECOVER_PASSPHRASE_NOT_ACCEPTED";
                } | {
                    type: "RECOVERED";
                    reason: "RECOVERY_COMPLETED";
                } | {
                    type: "WAITING_FOR_COMMAND";
                    reason: "COMMAND_REQUIRED" | "SESSION_EXPIRED" | "INVALID_COMMAND";
                };
            };
        }, {
            status: number;
        }>;
    };
    type Responses = {
        [A in keyof typeof Responses]: ReturnType<typeof Responses[A]["as"]>;
    };
}
