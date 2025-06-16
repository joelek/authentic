import { guards } from "@joelek/autoguard";
import { Attribute, computed, State, stateify } from "@joelek/bonsai";

const Language = guards.Union.of(
	guards.StringLiteral.of("en"),
	guards.StringLiteral.of("sv")
);

type Language = ReturnType<typeof Language["as"]>;

const WAITING_FOR_REGISTER_USERNAME = {
	"WAITING_FOR_REGISTER_USERNAME": {
		en: "Please enter your desired username. The username may contain letters A-Z, numbers 0-9 as well as the \"_\" character.",
		sv: "Vänligen ange ditt önskade användarnamn. Användarnamnet får innehålla bokstäverna A-Z, sifforna 0-9 samt tecknet \"_\"."
	},
	"REGISTER_USERNAME_REQUIRED": {
		en: "Your desired username has not yet been entered.",
		sv: "Ditt önskade användarnamn har ännu inte angetts."
	},
	"REGISTER_USERNAME_NOT_ACCEPTED": {
		en: "The username was not accepted. Please make sure that it only contains valid characters and try again.",
		sv: "Användarnamnet accepterades ej. Vänligen kontrollera så att det endast innehåller tillåtna tecken och försök sedan igen."
	},
	"REGISTER_USERNAME_NOT_AVAILABLE": {
		en: "The username is taken. Please try another one.",
		sv: "Användarnamnet är upptaget. Vänligen försök med ett annat."
	}
};

const WAITING_FOR_REGISTER_EMAIL = {
	"WAITING_FOR_REGISTER_EMAIL": {
		en: "Please enter your email address.",
		sv: "Vänligen ange din e-postadress."
	},
	"REGISTER_EMAIL_REQUIRED": {
		en: "Your email address has not yet been entered.",
		sv: "Din e-postadress har ännu inte angetts."
	},
	"REGISTER_EMAIL_NOT_ACCEPTED": {
		en: "The email address was not accepted. Please make sure that it's correctly written and try again.",
		sv: "E-postadressen accepterades ej. Vänligen kontrollera så att den är korrekt skriven och försök sedan igen."
	},
	"REGISTER_EMAIL_NOT_AVAILABLE": {
		en: "The email address is not available. Please try another one.",
		sv: "E-postadressen är inte tillgänglig. Vänligen försök med en annan."
	}
};

const WAITING_FOR_REGISTER_TOKEN = {
	"WAITING_FOR_REGISTER_TOKEN": {
		en: "Please enter the verification code that was sent to your email address.",
		sv: "Vänligen ange den verifieringskod som skickades till din e-postadress."
	},
	"REGISTER_TOKEN_REQUIRED": {
		en: "The verification code has not yet been entered.",
		sv: "Verifieringskoden har ännu inte angetts."
	},
	"REGISTER_TOKEN_NOT_ACCEPTED": {
		en: "The verification code was not accepted. Please make sure that it's correct and try again.",
		sv: "Verifieringskoden accepterades ej. Vänligen kontrollera så att den stämmer och försök sedan igen."
	}
};

const WAITING_FOR_REGISTER_PASSPHRASE = {
	"WAITING_FOR_REGISTER_PASSPHRASE": {
		en: "Please enter your desired password. Passwords must contain at least 8 characters.",
		sv: "Vänligen ange ditt önskade lösenord. Lösenord måste bestå av minst 8 tecken."
	},
	"REGISTER_PASSPHRASE_REQUIRED": {
		en: "Your password has not yet been entered.",
		sv: "Ditt lösenord har ännu inte angetts."
	},
	"REGISTER_PASSPHRASE_NOT_ACCEPTED": {
		en: "The password was not accepted. Please make sure that it's sufficiently long and try again.",
		sv: "Lösenordet accepterades ej. Vänligen kontrollera så att det är tillräckligt långt och försök sedan igen."
	}
};

const REGISTER_STATES = {
	...WAITING_FOR_REGISTER_USERNAME,
	...WAITING_FOR_REGISTER_EMAIL,
	...WAITING_FOR_REGISTER_TOKEN,
	...WAITING_FOR_REGISTER_PASSPHRASE
};

const WAITING_FOR_AUTHENTICATE_USERNAME = {
	"WAITING_FOR_AUTHENTICATE_USERNAME": {
		en: "Please enter your username.",
		sv: "Vänligen ange ditt användarnamn."
	},
	"AUTHENTICATE_USERNAME_REQUIRED": {
		en: "Your username has not yet been entered.",
		sv: "Ditt användarnamn har ännu inte angetts."
	},
	"AUTHENTICATE_USERNAME_NOT_ACCEPTED": {
		en: "The username was not accepted. Please make sure that it's correct and try again.",
		sv: "Användarnamnet accepterades ej. Vänligen kontrollera att det stämmer och försök sedan igen."
	},
	"AUTHENTICATE_USERNAME_NOT_AVAILABLE": {
		en: "The username is not available. Please try another one.",
		sv: "Användarnamnet är inte tillgängligt. Vänligen försök med ett annat."
	}
};

const WAITING_FOR_AUTHENTICATE_EMAIL = {
	"WAITING_FOR_AUTHENTICATE_EMAIL": {
		en: "Please enter your email address.",
		sv: "Vänligen ange din e-postadress."
	},
	"AUTHENTICATE_EMAIL_REQUIRED": {
		en: "Your email address has not yet been entered.",
		sv: "Din e-postadress har ännu inte angetts."
	},
	"AUTHENTICATE_EMAIL_NOT_ACCEPTED": {
		en: "The email address was not accepted. Please make sure that it's correctly written and try again.",
		sv: "E-postadressen accepterades ej. Vänligen kontrollera så att den är korrekt skriven och försök sedan igen."
	},
	"AUTHENTICATE_EMAIL_NOT_AVAILABLE": {
		en: "The email address is not available. Please try another one.",
		sv: "E-postadressen är inte tillgänglig. Vänligen försök med en annan."
	}
};

const WAITING_FOR_AUTHENTICATE_TOKEN = {
	"WAITING_FOR_AUTHENTICATE_TOKEN": {
		en: "Please enter the verification code that was sent to your email address.",
		sv: "Vänligen ange den verifieringskod som skickades till din e-postadress."
	},
	"AUTHENTICATE_TOKEN_REQUIRED": {
		en: "The verification code has not yet been entered.",
		sv: "Verifieringskoden har ännu inte angetts."
	},
	"AUTHENTICATE_TOKEN_NOT_ACCEPTED": {
		en: "The verification code was not accepted. Please make sure that it's correct and try again.",
		sv: "Verifieringskoden accepterades ej. Vänligen kontrollera så att den stämmer och försök sedan igen."
	}
};

const WAITING_FOR_AUTHENTICATE_PASSPHRASE = {
	"WAITING_FOR_AUTHENTICATE_PASSPHRASE": {
		en: "Please enter your password.",
		sv: "Vänligen ange ditt lösenord."
	},
	"AUTHENTICATE_PASSPHRASE_REQUIRED": {
		en: "Your password has not yet been entered.",
		sv: "Ditt lösenord har ännu inte angetts."
	},
	"AUTHENTICATE_PASSPHRASE_NOT_ACCEPTED": {
		en: "The password was not accepted. Please make sure that it's correct and try again.",
		sv: "Lösenordet accepterades ej. Vänligen kontrollera så att det stämmer och försök sedan igen."
	}
};

const AUTHENTICATE_STATES = {
	...WAITING_FOR_AUTHENTICATE_USERNAME,
	...WAITING_FOR_AUTHENTICATE_EMAIL,
	...WAITING_FOR_AUTHENTICATE_TOKEN,
	...WAITING_FOR_AUTHENTICATE_PASSPHRASE
};

const WAITING_FOR_RECOVER_USERNAME = {
	"WAITING_FOR_RECOVER_USERNAME": {
		en: "Please enter your username.",
		sv: "Vänligen ange ditt användarnamn."
	},
	"RECOVER_USERNAME_REQUIRED": {
		en: "Your username has not yet been entered.",
		sv: "Ditt användarnamn har ännu inte angetts."
	},
	"RECOVER_USERNAME_NOT_ACCEPTED": {
		en: "The username was not accepted. Please make sure that it's correct and try again.",
		sv: "Användarnamnet accepterades ej. Vänligen kontrollera att det stämmer och försök sedan igen."
	},
	"RECOVER_USERNAME_NOT_AVAILABLE": {
		en: "The username is not available. Please try another one.",
		sv: "Användarnamnet är inte tillgängligt. Vänligen försök med ett annat."
	}
};

const WAITING_FOR_RECOVER_EMAIL = {
	"WAITING_FOR_RECOVER_EMAIL": {
		en: "Please enter your email address.",
		sv: "Vänligen ange din e-postadress."
	},
	"RECOVER_EMAIL_REQUIRED": {
		en: "Your email address has not yet been entered.",
		sv: "Din e-postadress har ännu inte angetts."
	},
	"RECOVER_EMAIL_NOT_ACCEPTED": {
		en: "The email address was not accepted. Please make sure that it's correctly written and try again.",
		sv: "E-postadressen accepterades ej. Vänligen kontrollera så att den är korrekt skriven och försök sedan igen."
	},
	"RECOVER_EMAIL_NOT_AVAILABLE": {
		en: "The email address is not available. Please try another one.",
		sv: "E-postadressen är inte tillgänglig. Vänligen försök med en annan."
	}
};

const WAITING_FOR_RECOVER_TOKEN = {
	"WAITING_FOR_RECOVER_TOKEN": {
		en: "Please enter the verification code that was sent to your email address.",
		sv: "Vänligen ange den verifieringskod som skickades till din e-postadress."
	},
	"RECOVER_TOKEN_REQUIRED": {
		en: "The verification code has not yet been entered.",
		sv: "Verifieringskoden har ännu inte angetts."
	},
	"RECOVER_TOKEN_NOT_ACCEPTED": {
		en: "The verification code was not accepted. Please make sure that it's correct and try again.",
		sv: "Verifieringskoden accepterades ej. Vänligen kontrollera så att den stämmer och försök sedan igen."
	}
};

const WAITING_FOR_RECOVER_PASSPHRASE = {
	"WAITING_FOR_RECOVER_PASSPHRASE": {
		en: "Please enter your desired password. Passwords must contain at least 8 characters.",
		sv: "Vänligen ange ditt önskade lösenord. Lösenord måste bestå av minst 8 tecken."
	},
	"RECOVER_PASSPHRASE_REQUIRED": {
		en: "Your desired password has not yet been entered.",
		sv: "Ditt önskade lösenord har ännu inte angetts."
	},
	"RECOVER_PASSPHRASE_NOT_ACCEPTED": {
		en: "The password was not accepted. Please make sure that it's sufficiently long and try again.",
		sv: "Lösenordet accepterades ej. Vänligen kontrollera så att det är tillräckligt långt och försök sedan igen."
	}
};

const RECOVER_STATES = {
	...WAITING_FOR_RECOVER_USERNAME,
	...WAITING_FOR_RECOVER_EMAIL,
	...WAITING_FOR_RECOVER_TOKEN,
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
	"CANCEL": {
		en: "Cancel",
		sv: "Avbryt"
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
	"TOKEN_PLACEHOLDER": {
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
