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
export declare const RegisterCodeCommand: autoguard.serialization.MessageGuard<RegisterCodeCommand>;
export type RegisterCodeCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"REGISTER_CODE">;
    "code": autoguard.guards.String;
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
    autoguard.guards.Reference<RegisterCodeCommand>,
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
export declare const WaitingForRegisterCodeState: autoguard.serialization.MessageGuard<WaitingForRegisterCodeState>;
export type WaitingForRegisterCodeState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"WAITING_FOR_REGISTER_CODE">;
    "reason": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"REGISTER_CODE_REQUIRED">,
        autoguard.guards.StringLiteral<"REGISTER_CODE_NOT_ACCEPTED">
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
export declare const RegisterStates: autoguard.serialization.MessageGuard<RegisterStates>;
export type RegisterStates = autoguard.guards.Union<[
    autoguard.guards.Reference<WaitingForRegisterUsernameState>,
    autoguard.guards.Reference<WaitingForRegisterEmailState>,
    autoguard.guards.Reference<WaitingForRegisterCodeState>,
    autoguard.guards.Reference<WaitingForRegisterPassphraseState>
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
export declare const AuthenticateCodeCommand: autoguard.serialization.MessageGuard<AuthenticateCodeCommand>;
export type AuthenticateCodeCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"AUTHENTICATE_CODE">;
    "code": autoguard.guards.String;
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
    autoguard.guards.Reference<AuthenticateCodeCommand>,
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
export declare const WaitingForAuthenticateCodeState: autoguard.serialization.MessageGuard<WaitingForAuthenticateCodeState>;
export type WaitingForAuthenticateCodeState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"WAITING_FOR_AUTHENTICATE_CODE">;
    "reason": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"AUTHENTICATE_CODE_REQUIRED">,
        autoguard.guards.StringLiteral<"AUTHENTICATE_CODE_NOT_ACCEPTED">
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
export declare const AuthenticateStates: autoguard.serialization.MessageGuard<AuthenticateStates>;
export type AuthenticateStates = autoguard.guards.Union<[
    autoguard.guards.Reference<WaitingForAuthenticateUsernameState>,
    autoguard.guards.Reference<WaitingForAuthenticateEmailState>,
    autoguard.guards.Reference<WaitingForAuthenticateCodeState>,
    autoguard.guards.Reference<WaitingForAuthenticatePassphraseState>
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
export declare const RecoverCodeCommand: autoguard.serialization.MessageGuard<RecoverCodeCommand>;
export type RecoverCodeCommand = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"RECOVER_CODE">;
    "code": autoguard.guards.String;
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
    autoguard.guards.Reference<RecoverCodeCommand>,
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
export declare const WaitingForRecoverCodeState: autoguard.serialization.MessageGuard<WaitingForRecoverCodeState>;
export type WaitingForRecoverCodeState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"WAITING_FOR_RECOVER_CODE">;
    "reason": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"RECOVER_CODE_REQUIRED">,
        autoguard.guards.StringLiteral<"RECOVER_CODE_NOT_ACCEPTED">
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
export declare const RecoverStates: autoguard.serialization.MessageGuard<RecoverStates>;
export type RecoverStates = autoguard.guards.Union<[
    autoguard.guards.Reference<WaitingForRecoverUsernameState>,
    autoguard.guards.Reference<WaitingForRecoverEmailState>,
    autoguard.guards.Reference<WaitingForRecoverCodeState>,
    autoguard.guards.Reference<WaitingForRecoverPassphraseState>
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
export declare const AuthenticatedState: autoguard.serialization.MessageGuard<AuthenticatedState>;
export type AuthenticatedState = autoguard.guards.Object<{
    "type": autoguard.guards.StringLiteral<"AUTHENTICATED">;
    "reason": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"REGISTRATION_COMPLETED">,
        autoguard.guards.StringLiteral<"AUTHENTICATION_COMPLETED">,
        autoguard.guards.StringLiteral<"RECOVERY_COMPLETED">
    ]>;
}, {}>;
export declare const State: autoguard.serialization.MessageGuard<State>;
export type State = autoguard.guards.Union<[
    autoguard.guards.Reference<WaitingForCommandState>,
    autoguard.guards.Reference<RegisterStates>,
    autoguard.guards.Reference<AuthenticateStates>,
    autoguard.guards.Reference<RecoverStates>,
    autoguard.guards.Reference<AuthenticatedState>
]>;
export declare const User: autoguard.serialization.MessageGuard<User>;
export type User = autoguard.guards.Object<{
    "user_id": autoguard.guards.String;
    "email": autoguard.guards.String;
    "roles": autoguard.guards.Array<autoguard.guards.String>;
}, {
    "username": autoguard.guards.String;
}>;
export declare const Language: autoguard.serialization.MessageGuard<Language>;
export type Language = autoguard.guards.Union<[
    autoguard.guards.StringLiteral<"en">,
    autoguard.guards.StringLiteral<"sv">
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
        RegisterCodeCommand: autoguard.guards.ReferenceGuard<{
            type: "REGISTER_CODE";
            code: string;
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
            type: "REGISTER_CODE";
            code: string;
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
        WaitingForRegisterCodeState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_REGISTER_CODE";
            reason: "REGISTER_CODE_REQUIRED" | "REGISTER_CODE_NOT_ACCEPTED";
        }>;
        WaitingForRegisterPassphraseState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_REGISTER_PASSPHRASE";
            reason: "REGISTER_PASSPHRASE_REQUIRED" | "REGISTER_PASSPHRASE_NOT_ACCEPTED";
        }>;
        RegisterStates: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_REGISTER_USERNAME";
            reason: "REGISTER_USERNAME_REQUIRED" | "REGISTER_USERNAME_NOT_ACCEPTED" | "REGISTER_USERNAME_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_REGISTER_EMAIL";
            reason: "REGISTER_EMAIL_REQUIRED" | "REGISTER_EMAIL_NOT_ACCEPTED" | "REGISTER_EMAIL_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_REGISTER_CODE";
            reason: "REGISTER_CODE_REQUIRED" | "REGISTER_CODE_NOT_ACCEPTED";
        } | {
            type: "WAITING_FOR_REGISTER_PASSPHRASE";
            reason: "REGISTER_PASSPHRASE_REQUIRED" | "REGISTER_PASSPHRASE_NOT_ACCEPTED";
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
        AuthenticateCodeCommand: autoguard.guards.ReferenceGuard<{
            type: "AUTHENTICATE_CODE";
            code: string;
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
            type: "AUTHENTICATE_CODE";
            code: string;
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
        WaitingForAuthenticateCodeState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_AUTHENTICATE_CODE";
            reason: "AUTHENTICATE_CODE_REQUIRED" | "AUTHENTICATE_CODE_NOT_ACCEPTED";
        }>;
        WaitingForAuthenticatePassphraseState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_AUTHENTICATE_PASSPHRASE";
            reason: "AUTHENTICATE_PASSPHRASE_REQUIRED" | "AUTHENTICATE_PASSPHRASE_NOT_ACCEPTED";
        }>;
        AuthenticateStates: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_AUTHENTICATE_USERNAME";
            reason: "AUTHENTICATE_USERNAME_REQUIRED" | "AUTHENTICATE_USERNAME_NOT_ACCEPTED" | "AUTHENTICATE_USERNAME_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_AUTHENTICATE_EMAIL";
            reason: "AUTHENTICATE_EMAIL_REQUIRED" | "AUTHENTICATE_EMAIL_NOT_ACCEPTED" | "AUTHENTICATE_EMAIL_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_AUTHENTICATE_CODE";
            reason: "AUTHENTICATE_CODE_REQUIRED" | "AUTHENTICATE_CODE_NOT_ACCEPTED";
        } | {
            type: "WAITING_FOR_AUTHENTICATE_PASSPHRASE";
            reason: "AUTHENTICATE_PASSPHRASE_REQUIRED" | "AUTHENTICATE_PASSPHRASE_NOT_ACCEPTED";
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
        RecoverCodeCommand: autoguard.guards.ReferenceGuard<{
            type: "RECOVER_CODE";
            code: string;
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
            type: "RECOVER_CODE";
            code: string;
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
        WaitingForRecoverCodeState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_RECOVER_CODE";
            reason: "RECOVER_CODE_REQUIRED" | "RECOVER_CODE_NOT_ACCEPTED";
        }>;
        WaitingForRecoverPassphraseState: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_RECOVER_PASSPHRASE";
            reason: "RECOVER_PASSPHRASE_REQUIRED" | "RECOVER_PASSPHRASE_NOT_ACCEPTED";
        }>;
        RecoverStates: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_RECOVER_USERNAME";
            reason: "RECOVER_USERNAME_REQUIRED" | "RECOVER_USERNAME_NOT_ACCEPTED" | "RECOVER_USERNAME_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_RECOVER_EMAIL";
            reason: "RECOVER_EMAIL_REQUIRED" | "RECOVER_EMAIL_NOT_ACCEPTED" | "RECOVER_EMAIL_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_RECOVER_CODE";
            reason: "RECOVER_CODE_REQUIRED" | "RECOVER_CODE_NOT_ACCEPTED";
        } | {
            type: "WAITING_FOR_RECOVER_PASSPHRASE";
            reason: "RECOVER_PASSPHRASE_REQUIRED" | "RECOVER_PASSPHRASE_NOT_ACCEPTED";
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
            type: "REGISTER_CODE";
            code: string;
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
            type: "AUTHENTICATE_CODE";
            code: string;
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
            type: "RECOVER_CODE";
            code: string;
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
        AuthenticatedState: autoguard.guards.ReferenceGuard<{
            type: "AUTHENTICATED";
            reason: "REGISTRATION_COMPLETED" | "AUTHENTICATION_COMPLETED" | "RECOVERY_COMPLETED";
        }>;
        State: autoguard.guards.ReferenceGuard<{
            type: "WAITING_FOR_REGISTER_USERNAME";
            reason: "REGISTER_USERNAME_REQUIRED" | "REGISTER_USERNAME_NOT_ACCEPTED" | "REGISTER_USERNAME_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_REGISTER_EMAIL";
            reason: "REGISTER_EMAIL_REQUIRED" | "REGISTER_EMAIL_NOT_ACCEPTED" | "REGISTER_EMAIL_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_REGISTER_CODE";
            reason: "REGISTER_CODE_REQUIRED" | "REGISTER_CODE_NOT_ACCEPTED";
        } | {
            type: "WAITING_FOR_REGISTER_PASSPHRASE";
            reason: "REGISTER_PASSPHRASE_REQUIRED" | "REGISTER_PASSPHRASE_NOT_ACCEPTED";
        } | {
            type: "WAITING_FOR_AUTHENTICATE_USERNAME";
            reason: "AUTHENTICATE_USERNAME_REQUIRED" | "AUTHENTICATE_USERNAME_NOT_ACCEPTED" | "AUTHENTICATE_USERNAME_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_AUTHENTICATE_EMAIL";
            reason: "AUTHENTICATE_EMAIL_REQUIRED" | "AUTHENTICATE_EMAIL_NOT_ACCEPTED" | "AUTHENTICATE_EMAIL_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_AUTHENTICATE_CODE";
            reason: "AUTHENTICATE_CODE_REQUIRED" | "AUTHENTICATE_CODE_NOT_ACCEPTED";
        } | {
            type: "WAITING_FOR_AUTHENTICATE_PASSPHRASE";
            reason: "AUTHENTICATE_PASSPHRASE_REQUIRED" | "AUTHENTICATE_PASSPHRASE_NOT_ACCEPTED";
        } | {
            type: "WAITING_FOR_RECOVER_USERNAME";
            reason: "RECOVER_USERNAME_REQUIRED" | "RECOVER_USERNAME_NOT_ACCEPTED" | "RECOVER_USERNAME_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_RECOVER_EMAIL";
            reason: "RECOVER_EMAIL_REQUIRED" | "RECOVER_EMAIL_NOT_ACCEPTED" | "RECOVER_EMAIL_NOT_AVAILABLE";
        } | {
            type: "WAITING_FOR_RECOVER_CODE";
            reason: "RECOVER_CODE_REQUIRED" | "RECOVER_CODE_NOT_ACCEPTED";
        } | {
            type: "WAITING_FOR_RECOVER_PASSPHRASE";
            reason: "RECOVER_PASSPHRASE_REQUIRED" | "RECOVER_PASSPHRASE_NOT_ACCEPTED";
        } | {
            type: "WAITING_FOR_COMMAND";
            reason: "COMMAND_REQUIRED" | "SESSION_EXPIRED" | "INVALID_COMMAND";
        } | {
            type: "AUTHENTICATED";
            reason: "REGISTRATION_COMPLETED" | "AUTHENTICATION_COMPLETED" | "RECOVERY_COMPLETED";
        }>;
        User: autoguard.guards.ReferenceGuard<{
            user_id: string;
            email: string;
            roles: autoguard.guards.Array<string>;
            username?: string | undefined;
        }>;
        Language: autoguard.guards.ReferenceGuard<"en" | "sv">;
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
                "x-preferred-language"?: "en" | "sv" | undefined;
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
                    type: "REGISTER_CODE";
                    code: string;
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
                    type: "AUTHENTICATE_CODE";
                    code: string;
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
                    type: "RECOVER_CODE";
                    code: string;
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
                "x-preferred-language"?: "en" | "sv" | undefined;
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
                    type: "WAITING_FOR_REGISTER_CODE";
                    reason: "REGISTER_CODE_REQUIRED" | "REGISTER_CODE_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_REGISTER_PASSPHRASE";
                    reason: "REGISTER_PASSPHRASE_REQUIRED" | "REGISTER_PASSPHRASE_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_AUTHENTICATE_USERNAME";
                    reason: "AUTHENTICATE_USERNAME_REQUIRED" | "AUTHENTICATE_USERNAME_NOT_ACCEPTED" | "AUTHENTICATE_USERNAME_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_AUTHENTICATE_EMAIL";
                    reason: "AUTHENTICATE_EMAIL_REQUIRED" | "AUTHENTICATE_EMAIL_NOT_ACCEPTED" | "AUTHENTICATE_EMAIL_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_AUTHENTICATE_CODE";
                    reason: "AUTHENTICATE_CODE_REQUIRED" | "AUTHENTICATE_CODE_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_AUTHENTICATE_PASSPHRASE";
                    reason: "AUTHENTICATE_PASSPHRASE_REQUIRED" | "AUTHENTICATE_PASSPHRASE_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_RECOVER_USERNAME";
                    reason: "RECOVER_USERNAME_REQUIRED" | "RECOVER_USERNAME_NOT_ACCEPTED" | "RECOVER_USERNAME_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_RECOVER_EMAIL";
                    reason: "RECOVER_EMAIL_REQUIRED" | "RECOVER_EMAIL_NOT_ACCEPTED" | "RECOVER_EMAIL_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_RECOVER_CODE";
                    reason: "RECOVER_CODE_REQUIRED" | "RECOVER_CODE_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_RECOVER_PASSPHRASE";
                    reason: "RECOVER_PASSPHRASE_REQUIRED" | "RECOVER_PASSPHRASE_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_COMMAND";
                    reason: "COMMAND_REQUIRED" | "SESSION_EXPIRED" | "INVALID_COMMAND";
                } | {
                    type: "AUTHENTICATED";
                    reason: "REGISTRATION_COMPLETED" | "AUTHENTICATION_COMPLETED" | "RECOVERY_COMPLETED";
                };
                user?: {
                    user_id: string;
                    email: string;
                    roles: autoguard.guards.Array<string>;
                    username?: string | undefined;
                } | undefined;
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
                    type: "WAITING_FOR_REGISTER_CODE";
                    reason: "REGISTER_CODE_REQUIRED" | "REGISTER_CODE_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_REGISTER_PASSPHRASE";
                    reason: "REGISTER_PASSPHRASE_REQUIRED" | "REGISTER_PASSPHRASE_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_AUTHENTICATE_USERNAME";
                    reason: "AUTHENTICATE_USERNAME_REQUIRED" | "AUTHENTICATE_USERNAME_NOT_ACCEPTED" | "AUTHENTICATE_USERNAME_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_AUTHENTICATE_EMAIL";
                    reason: "AUTHENTICATE_EMAIL_REQUIRED" | "AUTHENTICATE_EMAIL_NOT_ACCEPTED" | "AUTHENTICATE_EMAIL_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_AUTHENTICATE_CODE";
                    reason: "AUTHENTICATE_CODE_REQUIRED" | "AUTHENTICATE_CODE_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_AUTHENTICATE_PASSPHRASE";
                    reason: "AUTHENTICATE_PASSPHRASE_REQUIRED" | "AUTHENTICATE_PASSPHRASE_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_RECOVER_USERNAME";
                    reason: "RECOVER_USERNAME_REQUIRED" | "RECOVER_USERNAME_NOT_ACCEPTED" | "RECOVER_USERNAME_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_RECOVER_EMAIL";
                    reason: "RECOVER_EMAIL_REQUIRED" | "RECOVER_EMAIL_NOT_ACCEPTED" | "RECOVER_EMAIL_NOT_AVAILABLE";
                } | {
                    type: "WAITING_FOR_RECOVER_CODE";
                    reason: "RECOVER_CODE_REQUIRED" | "RECOVER_CODE_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_RECOVER_PASSPHRASE";
                    reason: "RECOVER_PASSPHRASE_REQUIRED" | "RECOVER_PASSPHRASE_NOT_ACCEPTED";
                } | {
                    type: "WAITING_FOR_COMMAND";
                    reason: "COMMAND_REQUIRED" | "SESSION_EXPIRED" | "INVALID_COMMAND";
                } | {
                    type: "AUTHENTICATED";
                    reason: "REGISTRATION_COMPLETED" | "AUTHENTICATION_COMPLETED" | "RECOVERY_COMPLETED";
                };
                user?: {
                    user_id: string;
                    email: string;
                    roles: autoguard.guards.Array<string>;
                    username?: string | undefined;
                } | undefined;
            };
        }, {
            status: number;
        }>;
    };
    type Responses = {
        [A in keyof typeof Responses]: ReturnType<typeof Responses[A]["as"]>;
    };
}
