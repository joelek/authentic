import { Language } from "../../shared";
import { Attribute, State } from "@joelek/bonsai";
declare const STATES: {
    AUTHENTICATED: {
        en: string;
        sv: string;
    };
    AUTHENTICATION_COMPLETED: {
        en: string;
        sv: string;
    };
    REGISTRATION_COMPLETED: {
        en: string;
        sv: string;
    };
    RECOVERY_COMPLETED: {
        en: string;
        sv: string;
    };
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
    WAITING_FOR_RECOVER_CODE: {
        en: string;
        sv: string;
    };
    RECOVER_CODE_REQUIRED: {
        en: string;
        sv: string;
    };
    RECOVER_CODE_NOT_ACCEPTED: {
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
    WAITING_FOR_AUTHENTICATE_CODE: {
        en: string;
        sv: string;
    };
    AUTHENTICATE_CODE_REQUIRED: {
        en: string;
        sv: string;
    };
    AUTHENTICATE_CODE_NOT_ACCEPTED: {
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
    WAITING_FOR_REGISTER_CODE: {
        en: string;
        sv: string;
    };
    REGISTER_CODE_REQUIRED: {
        en: string;
        sv: string;
    };
    REGISTER_CODE_NOT_ACCEPTED: {
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
    CANCEL: {
        en: string;
        sv: string;
    };
    REGISTER_ACCOUNT: {
        en: string;
        sv: string;
    };
    AUTHENTICATE_ACCOUNT: {
        en: string;
        sv: string;
    };
    RECOVER_ACCOUNT: {
        en: string;
        sv: string;
    };
    CONTINUE: {
        en: string;
        sv: string;
    };
    LOG_OUT: {
        en: string;
        sv: string;
    };
    EMAIL_PLACEHOLDER: {
        en: string;
        sv: string;
    };
    PASSPHRASE_PLACEHOLDER: {
        en: string;
        sv: string;
    };
    CODE_PLACEHOLDER: {
        en: string;
        sv: string;
    };
    USERNAME_PLACEHOLDER: {
        en: string;
        sv: string;
    };
    LOGGED_IN_AS: {
        en: string;
        sv: string;
    };
    LANGUAGES: {
        en: string;
        sv: string;
    };
    LANGUAGE_EN: {
        en: string;
        sv: string;
    };
    LANGUAGE_SV: {
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
    getLanguage(): State<Language>;
    getTranslation(attribute: Attribute<TranslationsKey | undefined>): State<string>;
    getStateTranslation(attribute: Attribute<StatesKey | undefined>): State<string>;
}
export {};
