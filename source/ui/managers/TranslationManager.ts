import { Language } from "../../api/client";
import { Attribute, computed, State, stateify } from "@joelek/bonsai";

const WAITING_FOR_REGISTER_USERNAME = {
	"WAITING_FOR_REGISTER_USERNAME": {
		en: "Please enter your desired username. The username may contain letters A-Z, numbers 0-9 as well as the \"_\" character.",
		sv: "Vänligen ange ditt önskade användarnamn. Användarnamnet får innehålla bokstäverna A-Z, sifforna 0-9 samt tecknet \"_\"."
	},
	"REGISTER_USERNAME_REQUIRED": {
		en: "A username has not yet been entered.",
		sv: "Ett användarnamn har ännu inte angetts."
	},
	"REGISTER_USERNAME_NOT_ACCEPTED": {
		en: "The username was not accepted. Please make sure that it only contains valid characters and try again.",
		sv: "Användarnamnet accepterades inte. Vänligen kontrollera att det endast innehåller tillåtna tecken och försök sedan igen."
	},
	"REGISTER_USERNAME_NOT_AVAILABLE": {
		en: "The username is already taken. Please select another one and try again.",
		sv: "Användarnamnet är redan upptaget. Vänligen välj ett annat och försök igen."
	}
};

const WAITING_FOR_REGISTER_EMAIL = {
	"WAITING_FOR_REGISTER_EMAIL": {
		en: "Please enter your email address.",
		sv: "Vänligen ange din e-postadress."
	},
	"REGISTER_EMAIL_REQUIRED": {
		en: "An email address has not yet been entered.",
		sv: "En e-postadress har ännu inte angetts."
	},
	"REGISTER_EMAIL_NOT_ACCEPTED": {
		en: "The email address was not accepted. Please make sure that it's correct and try again.",
		sv: "E-postadressen accepterades inte. Vänligen kontrollera att den stämmer och försök sedan igen."
	},
	"REGISTER_EMAIL_NOT_AVAILABLE": {
		en: "The email address is already taken. Please select another one and try again.",
		sv: "E-postadressen är redan upptagen. Vänligen välj en annan och försök igen."
	}
};

const WAITING_FOR_REGISTER_CODE = {
	"WAITING_FOR_REGISTER_CODE": {
		en: "Please enter the verification code that was sent to your email address.",
		sv: "Vänligen ange den verifieringskod som skickades till din e-postadress."
	},
	"REGISTER_CODE_REQUIRED": {
		en: "A verification code has not yet been entered.",
		sv: "En verifieringskod har ännu inte angetts."
	},
	"REGISTER_CODE_NOT_ACCEPTED": {
		en: "The verification code was not accepted. Please make sure that it's correct and try again.",
		sv: "Verifieringskoden accepterades inte. Vänligen kontrollera att den stämmer och försök sedan igen."
	}
};

const WAITING_FOR_REGISTER_PASSPHRASE = {
	"WAITING_FOR_REGISTER_PASSPHRASE": {
		en: "Please enter your desired password. Passwords must contain at least 8 characters.",
		sv: "Vänligen ange ditt önskade lösenord. Lösenord måste bestå av minst 8 tecken."
	},
	"REGISTER_PASSPHRASE_REQUIRED": {
		en: "A password has not yet been entered.",
		sv: "Ett lösenord har ännu inte angetts."
	},
	"REGISTER_PASSPHRASE_NOT_ACCEPTED": {
		en: "The password was not accepted. Please make sure that it's sufficiently long and try again.",
		sv: "Lösenordet accepterades inte. Vänligen kontrollera att det är tillräckligt långt och försök sedan igen."
	}
};

const REGISTER_STATES = {
	...WAITING_FOR_REGISTER_USERNAME,
	...WAITING_FOR_REGISTER_EMAIL,
	...WAITING_FOR_REGISTER_CODE,
	...WAITING_FOR_REGISTER_PASSPHRASE
};

const WAITING_FOR_AUTHENTICATE_USERNAME = {
	"WAITING_FOR_AUTHENTICATE_USERNAME": {
		en: "Please enter your username.",
		sv: "Vänligen ange ditt användarnamn."
	},
	"AUTHENTICATE_USERNAME_REQUIRED": {
		en: "A username has not yet been entered.",
		sv: "Ett användarnamn har ännu inte angetts."
	},
	"AUTHENTICATE_USERNAME_NOT_ACCEPTED": {
		en: "The username was not accepted. Please make sure that it's correct and try again.",
		sv: "Användarnamnet accepterades inte. Vänligen kontrollera att det stämmer och försök sedan igen."
	},
	"AUTHENTICATE_USERNAME_NOT_AVAILABLE": {
		en: "The username is not in use. Please try another one.",
		sv: "Användarnamnet används inte. Vänligen försök med ett annat."
	}
};

const WAITING_FOR_AUTHENTICATE_EMAIL = {
	"WAITING_FOR_AUTHENTICATE_EMAIL": {
		en: "Please enter your email address.",
		sv: "Vänligen ange din e-postadress."
	},
	"AUTHENTICATE_EMAIL_REQUIRED": {
		en: "An email address has not yet been entered.",
		sv: "En e-postadress har ännu inte angetts."
	},
	"AUTHENTICATE_EMAIL_NOT_ACCEPTED": {
		en: "The email address was not accepted. Please make sure that it's correct and try again.",
		sv: "E-postadressen accepterades inte. Vänligen kontrollera att den stämmer och försök sedan igen."
	},
	"AUTHENTICATE_EMAIL_NOT_AVAILABLE": {
		en: "The email address is not in use. Please try another one.",
		sv: "E-postadressen används inte. Vänligen försök med en annan."
	}
};

const WAITING_FOR_AUTHENTICATE_CODE = {
	"WAITING_FOR_AUTHENTICATE_CODE": {
		en: "Please enter the verification code that was sent to your email address.",
		sv: "Vänligen ange den verifieringskod som skickades till din e-postadress."
	},
	"AUTHENTICATE_CODE_REQUIRED": {
		en: "A verification code has not yet been entered.",
		sv: "En verifieringskod har ännu inte angetts."
	},
	"AUTHENTICATE_CODE_NOT_ACCEPTED": {
		en: "The verification code was not accepted. Please make sure that it's correct and try again.",
		sv: "Verifieringskoden accepterades inte. Vänligen kontrollera att den stämmer och försök sedan igen."
	}
};

const WAITING_FOR_AUTHENTICATE_PASSPHRASE = {
	"WAITING_FOR_AUTHENTICATE_PASSPHRASE": {
		en: "Please enter your password.",
		sv: "Vänligen ange ditt lösenord."
	},
	"AUTHENTICATE_PASSPHRASE_REQUIRED": {
		en: "A password has not yet been entered.",
		sv: "Ett lösenord har ännu inte angetts."
	},
	"AUTHENTICATE_PASSPHRASE_NOT_ACCEPTED": {
		en: "The password was not accepted. Please make sure that it's correct and try again.",
		sv: "Lösenordet accepterades inte. Vänligen kontrollera att det stämmer och försök sedan igen."
	}
};

const AUTHENTICATE_STATES = {
	...WAITING_FOR_AUTHENTICATE_USERNAME,
	...WAITING_FOR_AUTHENTICATE_EMAIL,
	...WAITING_FOR_AUTHENTICATE_CODE,
	...WAITING_FOR_AUTHENTICATE_PASSPHRASE
};

const WAITING_FOR_RECOVER_USERNAME = {
	"WAITING_FOR_RECOVER_USERNAME": {
		en: "Please enter your username.",
		sv: "Vänligen ange ditt användarnamn."
	},
	"RECOVER_USERNAME_REQUIRED": {
		en: "A username has not yet been entered.",
		sv: "Ett användarnamn har ännu inte angetts."
	},
	"RECOVER_USERNAME_NOT_ACCEPTED": {
		en: "The username was not accepted. Please make sure that it's correct and try again.",
		sv: "Användarnamnet accepterades inte. Vänligen kontrollera att det stämmer och försök sedan igen."
	},
	"RECOVER_USERNAME_NOT_AVAILABLE": {
		en: "The username is not in use. Please try another one.",
		sv: "Användarnamnet används inte. Vänligen försök med ett annat."
	}
};

const WAITING_FOR_RECOVER_EMAIL = {
	"WAITING_FOR_RECOVER_EMAIL": {
		en: "Please enter your email address.",
		sv: "Vänligen ange din e-postadress."
	},
	"RECOVER_EMAIL_REQUIRED": {
		en: "An email address has not yet been entered.",
		sv: "En e-postadress har ännu inte angetts."
	},
	"RECOVER_EMAIL_NOT_ACCEPTED": {
		en: "The email address was not accepted. Please make sure that it's correct and try again.",
		sv: "E-postadressen accepterades inte. Vänligen kontrollera att den stämmer och försök sedan igen."
	},
	"RECOVER_EMAIL_NOT_AVAILABLE": {
		en: "The email address is not in use. Please try another one.",
		sv: "E-postadressen används inte. Vänligen försök med en annan."
	}
};

const WAITING_FOR_RECOVER_CODE = {
	"WAITING_FOR_RECOVER_CODE": {
		en: "Please enter the verification code that was sent to your email address.",
		sv: "Vänligen ange den verifieringskod som skickades till din e-postadress."
	},
	"RECOVER_CODE_REQUIRED": {
		en: "A verification code has not yet been entered.",
		sv: "En verifieringskod har ännu inte angetts."
	},
	"RECOVER_CODE_NOT_ACCEPTED": {
		en: "The verification code was not accepted. Please make sure that it's correct and try again.",
		sv: "Verifieringskoden accepterades inte. Vänligen kontrollera att den stämmer och försök sedan igen."
	}
};

const WAITING_FOR_RECOVER_PASSPHRASE = {
	"WAITING_FOR_RECOVER_PASSPHRASE": {
		en: "Please enter your desired password. Passwords must contain at least 8 characters.",
		sv: "Vänligen ange ditt önskade lösenord. Lösenord måste bestå av minst 8 tecken."
	},
	"RECOVER_PASSPHRASE_REQUIRED": {
		en: "A password has not yet been entered.",
		sv: "Ett lösenord har ännu inte angetts."
	},
	"RECOVER_PASSPHRASE_NOT_ACCEPTED": {
		en: "The password was not accepted. Please make sure that it's sufficiently long and try again.",
		sv: "Lösenordet accepterades inte. Vänligen kontrollera att det är tillräckligt långt och försök sedan igen."
	}
};

const RECOVER_STATES = {
	...WAITING_FOR_RECOVER_USERNAME,
	...WAITING_FOR_RECOVER_EMAIL,
	...WAITING_FOR_RECOVER_CODE,
	...WAITING_FOR_RECOVER_PASSPHRASE
};

const WAITING_FOR_COMMAND = {
	"WAITING_FOR_COMMAND": {
		en: "Waiting for command.",
		sv: "Väntar på instruktion."
	},
	"COMMAND_REQUIRED": {
		en: "Command required.",
		sv: "Instruktion krävs."
	},
	"SESSION_EXPIRED": {
		en: "Session expired.",
		sv: "Sessionen har löpt ut."
	},
	"INVALID_COMMAND": {
		en: "Invalid command.",
		sv: "Ogiltig instruktion."
	}
};

const AUTHENTICATED = {
	"AUTHENTICATED": {
		en: "Your account has been authenticated.",
		sv: "Ditt konto har autentiserats."
	},
	"AUTHENTICATION_COMPLETED": {
		en: "Authentication completed.",
		sv: "Autentiseringen slutfördes."
	},
	"REGISTRATION_COMPLETED": {
		en: "Registration completed.",
		sv: "Registreringen slutfördes."
	},
	"RECOVERY_COMPLETED": {
		en: "Recovery completed.",
		sv: "Återställningen slutfördes."
	}
};

const STATES = {
	...REGISTER_STATES,
	...AUTHENTICATE_STATES,
	...RECOVER_STATES,
	...WAITING_FOR_COMMAND,
	...AUTHENTICATED
};

type States = typeof STATES;
type StatesKey = keyof States;

const TRANSLATIONS = {
	"MANAGE_ACCOUNT": {
		en: "Manage account",
		sv: "Hantera konto"
	},
	"RESTART": {
		en: "Restart",
		sv: "Börja om"
	},
	"REGISTER_ACCOUNT": {
		en: "Register account",
		sv: "Registrera konto"
	},
	"AUTHENTICATE_ACCOUNT": {
		en: "Authenticate account",
		sv: "Autentisera konto"
	},
	"RECOVER_ACCOUNT": {
		en: "Recover account",
		sv: "Återställ konto"
	},
	"CONTINUE": {
		en: "Continue",
		sv: "Fortsätt"
	},
	"LOG_OUT": {
		en: "Log out",
		sv: "Logga ut"
	},
	"EMAIL_PLACEHOLDER": {
		en: "Email address...",
		sv: "E-postadress..."
	},
	"PASSPHRASE_PLACEHOLDER": {
		en: "Password...",
		sv: "Lösenord..."
	},
	"CODE_PLACEHOLDER": {
		en: "Verification code...",
		sv: "Verifieringskod..."
	},
	"USERNAME_PLACEHOLDER": {
		en: "Username...",
		sv: "Användarnamn..."
	},
	"LOGGED_IN_AS": {
		en: "Logged in as",
		sv: "Inloggad som"
	},
	"LANGUAGES": {
		en: "Languages",
		sv: "Språk"
	},
	"LANGUAGE_EN": {
		en: "English",
		sv: "Engelska"
	},
	"LANGUAGE_SV": {
		en: "Swedish",
		sv: "Svenska"
	}
};

type Translations = typeof TRANSLATIONS;
type TranslationsKey = keyof Translations;

export class TranslationManager {
	protected language: State<Language>;

	protected updateLanguage(): void {
		for (let language of navigator.languages) {
			language = language.split("-")[0];
			if (Language.is(language)) {
				this.language.update(language);
				break;
			}
		}
	}

	constructor() {
		this.language = stateify("en");
		window.addEventListener("languagechange", () => {
			this.updateLanguage();
		});
		this.updateLanguage();
	}

	getLanguage(): State<Language> {
		return this.language;
	}

	getTranslation(attribute: Attribute<TranslationsKey | undefined>): State<string> {
		let key = stateify(attribute);
		return computed([key, this.language], (key, language) => {
			if (key == null) {
				return "";
			}
			return TRANSLATIONS[key][language];
		});
	}

	getStateTranslation(attribute: Attribute<StatesKey | undefined>): State<string> {
		let key = stateify(attribute);
		return computed([key, this.language], (key, language) => {
			if (key == null) {
				return "";
			}
			return STATES[key][language];
		});
	}
};
