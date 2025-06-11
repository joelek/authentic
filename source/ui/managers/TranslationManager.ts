import { guards } from "@joelek/autoguard";
import { Attribute, computed, State, stateify } from "@joelek/bonsai";

const Language = guards.Union.of(
	guards.StringLiteral.of("en"),
	guards.StringLiteral.of("sv")
);

type Language = ReturnType<typeof Language["as"]>;

const WAITING_FOR_REGISTER_USERNAME = {
	"WAITING_FOR_REGISTER_USERNAME": {
		en: "Please enter your username.",
		sv: "Vänligen ange ditt användarnamn."
	},
	"REGISTER_USERNAME_REQUIRED": {
		en: "Your username has not been entered.",
		sv: "Ditt användarnamn har ännu inte angetts."
	},
	"REGISTER_USERNAME_NOT_ACCEPTED": {
		en: "The username is not accepted. Please make sure that it's correct and try again.",
		sv: "Användarnamnet accepterades ej. Vänligen kontrollera att det stämmer och försök sedan igen."
	},
	"REGISTER_USERNAME_NOT_AVAILABLE": {
		en: "The username is not available. Please try another.",
		sv: "Användarnamnet är inte tillgängligt. Vänligen försök med ett annat."
	}
};

const WAITING_FOR_REGISTER_EMAIL = {
	"WAITING_FOR_REGISTER_EMAIL": {
		en: "Please enter your email address.",
		sv: "Vänligen ange din e-postadress."
	},
	"REGISTER_EMAIL_REQUIRED": {
		en: "Your email address has not been entered.",
		sv: "Din e-postadress har ännu inte angetts."
	},
	"REGISTER_EMAIL_NOT_ACCEPTED": {
		en: "The email address is not accepted. Please make sure that it's correct and try again.",
		sv: "E-postadressen accepterades ej. Vänligen kontrollera så att den stämmer och försök sedan igen."
	},
	"REGISTER_EMAIL_NOT_AVAILABLE": {
		en: "The email address is not available. Please try another.",
		sv: "E-postadressen är inte tillgänglig. Vänligen försök med en annan."
	}
};

const WAITING_FOR_REGISTER_TOKEN = {
	"WAITING_FOR_REGISTER_TOKEN": {
		en: "Please enter the verification code that was sent to your email address.",
		sv: "Vänligen ange den verifieringskod som skickades till din e-postadress."
	},
	"REGISTER_TOKEN_REQUIRED": {
		en: "The verification code has not been entered.",
		sv: "Verifieringskoden har ännu inte angetts."
	},
	"REGISTER_TOKEN_NOT_ACCEPTED": {
		en: "The verification code is not accepted. Please make sure that it's correct and try again.",
		sv: "Verifieringskoden accepterades ej. Vänligen kontrollera så att den stämmer och försök sedan igen."
	}
};

const WAITING_FOR_REGISTER_PASSPHRASE = {
	"WAITING_FOR_REGISTER_PASSPHRASE": {
		en: "Please enter your password.",
		sv: "Vänligen ange ditt lösenord."
	},
	"REGISTER_PASSPHRASE_REQUIRED": {
		en: "Your password has not been entered.",
		sv: "Ditt lösenord har ännu inte angetts."
	},
	"REGISTER_PASSPHRASE_NOT_ACCEPTED": {
		en: "The password is not accepted. Please make sure that it's correct and try again.",
		sv: "Lösenordet accepterades ej. Vänligen kontrollera så att det stämmer och försök sedan igen."
	}
};

const REGISTERED = {
	"REGISTERED": {
		en: "Your account has been registered.",
		sv: "Ditt konto har registrerats."
	},
	"REGISTRATION_COMPLETED": {
		en: "Registration completed.",
		sv: "Registreringen är slutförd."
	}
};

const REGISTER_STATES = {
	...WAITING_FOR_REGISTER_USERNAME,
	...WAITING_FOR_REGISTER_EMAIL,
	...WAITING_FOR_REGISTER_TOKEN,
	...WAITING_FOR_REGISTER_PASSPHRASE,
	...REGISTERED
};

const WAITING_FOR_AUTHENTICATE_USERNAME = {
	"WAITING_FOR_AUTHENTICATE_USERNAME": {
		en: "Please enter your username.",
		sv: "Vänligen ange ditt användarnamn."
	},
	"AUTHENTICATE_USERNAME_REQUIRED": {
		en: "Your username has not been entered.",
		sv: "Ditt användarnamn har ännu inte angetts."
	},
	"AUTHENTICATE_USERNAME_NOT_ACCEPTED": {
		en: "The username is not accepted. Please make sure that it's correct and try again.",
		sv: "Användarnamnet accepterades ej. Vänligen kontrollera att det stämmer och försök sedan igen."
	},
	"AUTHENTICATE_USERNAME_NOT_AVAILABLE": {
		en: "The username is not available. Please try another.",
		sv: "Användarnamnet är inte tillgängligt. Vänligen försök med ett annat."
	}
};

const WAITING_FOR_AUTHENTICATE_EMAIL = {
	"WAITING_FOR_AUTHENTICATE_EMAIL": {
		en: "Please enter your email address.",
		sv: "Vänligen ange din e-postadress."
	},
	"AUTHENTICATE_EMAIL_REQUIRED": {
		en: "Your email address has not been entered.",
		sv: "Din e-postadress har ännu inte angetts."
	},
	"AUTHENTICATE_EMAIL_NOT_ACCEPTED": {
		en: "The email address is not accepted. Please make sure that it's correct and try again.",
		sv: "E-postadressen accepterades ej. Vänligen kontrollera så att den stämmer och försök sedan igen."
	},
	"AUTHENTICATE_EMAIL_NOT_AVAILABLE": {
		en: "The email address is not available. Please try another.",
		sv: "E-postadressen är inte tillgänglig. Vänligen försök med en annan."
	}
};

const WAITING_FOR_AUTHENTICATE_TOKEN = {
	"WAITING_FOR_AUTHENTICATE_TOKEN": {
		en: "Please enter the verification code that was sent to your email address.",
		sv: "Vänligen ange den verifieringskod som skickades till din e-postadress."
	},
	"AUTHENTICATE_TOKEN_REQUIRED": {
		en: "The verification code has not been entered.",
		sv: "Verifieringskoden har ännu inte angetts."
	},
	"AUTHENTICATE_TOKEN_NOT_ACCEPTED": {
		en: "The verification code is not accepted. Please make sure that it's correct and try again.",
		sv: "Verifieringskoden accepterades ej. Vänligen kontrollera så att den stämmer och försök sedan igen."
	}
};

const WAITING_FOR_AUTHENTICATE_PASSPHRASE = {
	"WAITING_FOR_AUTHENTICATE_PASSPHRASE": {
		en: "Please enter your password.",
		sv: "Vänligen ange ditt lösenord."
	},
	"AUTHENTICATE_PASSPHRASE_REQUIRED": {
		en: "Your password has not been entered.",
		sv: "Ditt lösenord har ännu inte angetts."
	},
	"AUTHENTICATE_PASSPHRASE_NOT_ACCEPTED": {
		en: "The password is not accepted. Please make sure that it's correct and try again.",
		sv: "Lösenordet accepterades ej. Vänligen kontrollera så att det stämmer och försök sedan igen."
	}
};

const AUTHENTICATED = {
	"AUTHENTICATED": {
		en: "Your account has been authenticated.",
		sv: "Ditt konto har autentiserats."
	},
	"AUTHENTICATION_COMPLETED": {
		en: "Authentication completed.",
		sv: "Autentiseringen är slutförd."
	}
};

const AUTHENTICATE_STATES = {
	...WAITING_FOR_AUTHENTICATE_USERNAME,
	...WAITING_FOR_AUTHENTICATE_EMAIL,
	...WAITING_FOR_AUTHENTICATE_TOKEN,
	...WAITING_FOR_AUTHENTICATE_PASSPHRASE,
	...AUTHENTICATED
};

const WAITING_FOR_RECOVER_USERNAME = {
	"WAITING_FOR_RECOVER_USERNAME": {
		en: "Please enter your username.",
		sv: "Vänligen ange ditt användarnamn."
	},
	"RECOVER_USERNAME_REQUIRED": {
		en: "Your username has not been entered.",
		sv: "Ditt användarnamn har ännu inte angetts."
	},
	"RECOVER_USERNAME_NOT_ACCEPTED": {
		en: "The username is not accepted. Please make sure that it's correct and try again.",
		sv: "Användarnamnet accepterades ej. Vänligen kontrollera att det stämmer och försök sedan igen."
	},
	"RECOVER_USERNAME_NOT_AVAILABLE": {
		en: "The username is not available. Please try another.",
		sv: "Användarnamnet är inte tillgängligt. Vänligen försök med ett annat."
	}
};

const WAITING_FOR_RECOVER_EMAIL = {
	"WAITING_FOR_RECOVER_EMAIL": {
		en: "Please enter your email address.",
		sv: "Vänligen ange din e-postadress."
	},
	"RECOVER_EMAIL_REQUIRED": {
		en: "Your email address has not been entered.",
		sv: "Din e-postadress har ännu inte angetts."
	},
	"RECOVER_EMAIL_NOT_ACCEPTED": {
		en: "The email address is not accepted. Please make sure that it's correct and try again.",
		sv: "E-postadressen accepterades ej. Vänligen kontrollera så att den stämmer och försök sedan igen."
	},
	"RECOVER_EMAIL_NOT_AVAILABLE": {
		en: "The email address is not available. Please try another.",
		sv: "E-postadressen är inte tillgänglig. Vänligen försök med en annan."
	}
};

const WAITING_FOR_RECOVER_TOKEN = {
	"WAITING_FOR_RECOVER_TOKEN": {
		en: "Please enter the verification code that was sent to your email address.",
		sv: "Vänligen ange den verifieringskod som skickades till din e-postadress."
	},
	"RECOVER_TOKEN_REQUIRED": {
		en: "The verification code has not been entered.",
		sv: "Verifieringskoden har ännu inte angetts."
	},
	"RECOVER_TOKEN_NOT_ACCEPTED": {
		en: "The verification code is not accepted. Please make sure that it's correct and try again.",
		sv: "Verifieringskoden accepterades ej. Vänligen kontrollera så att den stämmer och försök sedan igen."
	}
};

const WAITING_FOR_RECOVER_PASSPHRASE = {
	"WAITING_FOR_RECOVER_PASSPHRASE": {
		en: "Please enter your password.",
		sv: "Vänligen ange ditt lösenord."
	},
	"RECOVER_PASSPHRASE_REQUIRED": {
		en: "Your password has not been entered.",
		sv: "Ditt lösenord har ännu inte angetts."
	},
	"RECOVER_PASSPHRASE_NOT_ACCEPTED": {
		en: "The password is not accepted. Please make sure that it's correct and try again.",
		sv: "Lösenordet accepterades ej. Vänligen kontrollera så att det stämmer och försök sedan igen."
	}
};

const RECOVERED = {
	"RECOVERED": {
		en: "Your account has been recovered.",
		sv: "Ditt konto har återställts."
	},
	"RECOVERY_COMPLETED": {
		en: "Recovery completed.",
		sv: "Återställningen är slutförd."
	}
};

const RECOVER_STATES = {
	...WAITING_FOR_RECOVER_USERNAME,
	...WAITING_FOR_RECOVER_EMAIL,
	...WAITING_FOR_RECOVER_TOKEN,
	...WAITING_FOR_RECOVER_PASSPHRASE,
	...RECOVERED
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

const STATES = {
	...REGISTER_STATES,
	...AUTHENTICATE_STATES,
	...RECOVER_STATES,
	...WAITING_FOR_COMMAND
};

type States = typeof STATES;
type StatesKey = keyof States;

const TRANSLATIONS = {
	"CANCEL_BUTTON": {
		en: "Cancel",
		sv: "Avbryt"
	},
	"REGISTER_BUTTON": {
		en: "Register account",
		sv: "Registrera konto"
	},
	"AUTHENTICATE_BUTTON": {
		en: "Authenticate account",
		sv: "Autentisera konto"
	},
	"RECOVER_BUTTON": {
		en: "Recover account",
		sv: "Återställ konto"
	},
	"CONTINUE_BUTTON": {
		en: "Continue",
		sv: "Fortsätt"
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
