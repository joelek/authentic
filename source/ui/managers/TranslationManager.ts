import { guards } from "@joelek/autoguard";
import { Attribute, computed, State, stateify } from "@joelek/bonsai";

const Language = guards.Union.of(
	guards.StringLiteral.of("en"),
	guards.StringLiteral.of("sv")
);

type Language = ReturnType<typeof Language["as"]>;

const TRANSLATIONS = {
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

type TranslationKey = keyof typeof TRANSLATIONS;

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

	getTranslation(attribute: Attribute<TranslationKey | undefined>): State<string> {
		let key = stateify(attribute);
		return computed([key, this.language], (key, language) => {
			if (key == null) {
				return "";
			}
			return TRANSLATIONS[key][language];
		});
	}
};
