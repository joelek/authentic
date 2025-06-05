import { guards } from "@joelek/autoguard";
import { Attribute, State } from "@joelek/bonsai";
declare const Language: guards.UnionGuard<["en", "sv"]>;
type Language = ReturnType<typeof Language["as"]>;
declare const STATES: {
    WAITING_FOR_COMMAND: {
        en: string;
        sv: string;
    };
    COMMAND_REQUIRED: {
        en: string;
        sv: string;
    };
    SESSION_EXPIRED: {
        en: string;
        sv: string;
    };
    INVALID_COMMAND: {
        en: string;
        sv: string;
    };
    RECOVERED: {
        en: string;
        sv: string;
    };
    RECOVERY_COMPLETED: {
        en: string;
        sv: string;
    };
    WAITING_FOR_RECOVER_PASSPHRASE: {
        en: string;
        sv: string;
    };
    RECOVER_PASSPHRASE_REQUIRED: {
        en: string;
        sv: string;
    };
    RECOVER_PASSPHRASE_NOT_ACCEPTED: {
        en: string;
        sv: string;
    };
    WAITING_FOR_RECOVER_TOKEN: {
        en: string;
        sv: string;
    };
    RECOVER_TOKEN_REQUIRED: {
        en: string;
        sv: string;
    };
    RECOVER_TOKEN_NOT_ACCEPTED: {
        en: string;
        sv: string;
    };
    WAITING_FOR_RECOVER_EMAIL: {
        en: string;
        sv: string;
    };
    RECOVER_EMAIL_REQUIRED: {
        en: string;
        sv: string;
    };
    RECOVER_EMAIL_NOT_ACCEPTED: {
        en: string;
        sv: string;
    };
    RECOVER_EMAIL_NOT_AVAILABLE: {
        en: string;
        sv: string;
    };
    WAITING_FOR_RECOVER_USERNAME: {
        en: string;
        sv: string;
    };
    RECOVER_USERNAME_REQUIRED: {
        en: string;
        sv: string;
    };
    RECOVER_USERNAME_NOT_ACCEPTED: {
        en: string;
        sv: string;
    };
    RECOVER_USERNAME_NOT_AVAILABLE: {
        en: string;
        sv: string;
    };
    AUTHENTICATED: {
        en: string;
        sv: string;
    };
    AUTHENTICATION_COMPLETED: {
        en: string;
        sv: string;
    };
    WAITING_FOR_AUTHENTICATE_PASSPHRASE: {
        en: string;
        sv: string;
    };
    AUTHENTICATE_PASSPHRASE_REQUIRED: {
        en: string;
        sv: string;
    };
    AUTHENTICATE_PASSPHRASE_NOT_ACCEPTED: {
        en: string;
        sv: string;
    };
    WAITING_FOR_AUTHENTICATE_TOKEN: {
        en: string;
        sv: string;
    };
    AUTHENTICATE_TOKEN_REQUIRED: {
        en: string;
        sv: string;
    };
    AUTHENTICATE_TOKEN_NOT_ACCEPTED: {
        en: string;
        sv: string;
    };
    WAITING_FOR_AUTHENTICATE_EMAIL: {
        en: string;
        sv: string;
    };
    AUTHENTICATE_EMAIL_REQUIRED: {
        en: string;
        sv: string;
    };
    AUTHENTICATE_EMAIL_NOT_ACCEPTED: {
        en: string;
        sv: string;
    };
    AUTHENTICATE_EMAIL_NOT_AVAILABLE: {
        en: string;
        sv: string;
    };
    WAITING_FOR_AUTHENTICATE_USERNAME: {
        en: string;
        sv: string;
    };
    AUTHENTICATE_USERNAME_REQUIRED: {
        en: string;
        sv: string;
    };
    AUTHENTICATE_USERNAME_NOT_ACCEPTED: {
        en: string;
        sv: string;
    };
    AUTHENTICATE_USERNAME_NOT_AVAILABLE: {
        en: string;
        sv: string;
    };
    REGISTERED: {
        en: string;
        sv: string;
    };
    REGISTRATION_COMPLETED: {
        en: string;
        sv: string;
    };
    WAITING_FOR_REGISTER_PASSPHRASE: {
        en: string;
        sv: string;
    };
    REGISTER_PASSPHRASE_REQUIRED: {
        en: string;
        sv: string;
    };
    REGISTER_PASSPHRASE_NOT_ACCEPTED: {
        en: string;
        sv: string;
    };
    WAITING_FOR_REGISTER_TOKEN: {
        en: string;
        sv: string;
    };
    REGISTER_TOKEN_REQUIRED: {
        en: string;
        sv: string;
    };
    REGISTER_TOKEN_NOT_ACCEPTED: {
        en: string;
        sv: string;
    };
    WAITING_FOR_REGISTER_EMAIL: {
        en: string;
        sv: string;
    };
    REGISTER_EMAIL_REQUIRED: {
        en: string;
        sv: string;
    };
    REGISTER_EMAIL_NOT_ACCEPTED: {
        en: string;
        sv: string;
    };
    REGISTER_EMAIL_NOT_AVAILABLE: {
        en: string;
        sv: string;
    };
    WAITING_FOR_REGISTER_USERNAME: {
        en: string;
        sv: string;
    };
    REGISTER_USERNAME_REQUIRED: {
        en: string;
        sv: string;
    };
    REGISTER_USERNAME_NOT_ACCEPTED: {
        en: string;
        sv: string;
    };
    REGISTER_USERNAME_NOT_AVAILABLE: {
        en: string;
        sv: string;
    };
};
type States = typeof STATES;
type StatesKey = keyof States;
declare const TRANSLATIONS: {
    REGISTER_BUTTON: {
        en: string;
        sv: string;
    };
    AUTHENTICATE_BUTTON: {
        en: string;
        sv: string;
    };
    RECOVER_BUTTON: {
        en: string;
        sv: string;
    };
    CONTINUE_BUTTON: {
        en: string;
        sv: string;
    };
    AUTHENTICATED_TEXT: {
        en: string;
        sv: string;
    };
    RECOVERED_TEXT: {
        en: string;
        sv: string;
    };
    REGISTERED_TEXT: {
        en: string;
        sv: string;
    };
};
type Translations = typeof TRANSLATIONS;
type TranslationsKey = keyof Translations;
export declare class TranslationManager {
    protected language: State<Language>;
    protected updateLanguage(): void;
    constructor();
    getTranslation(attribute: Attribute<TranslationsKey | undefined>): State<string>;
    getStateTranslation(attribute: Attribute<StatesKey | undefined>): State<string>;
}
export {};
