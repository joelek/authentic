"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createElementAndController = void 0;
const client_1 = require("../client");
const Modal_1 = require("./components/Modal");
const Variables_1 = require("./components/Variables");
const managers_1 = require("./managers");
;
function createElementAndController(options) {
    let client = options?.client ?? (0, client_1.createClient)();
    let managers = managers_1.Managers.create(client);
    let element = (0, Variables_1.Variables)(managers, {}, (0, Modal_1.Modal)(managers, {}));
    let visible = managers.state.visible;
    let theme = managers.state.theme;
    let controller = {
        logout: async () => {
            await managers.backend.sendCommand({
                headers: {
                    "x-preferred-language": managers.translation.getLanguage().value()
                },
                payload: {
                    command: {
                        type: "RESET_STATE"
                    }
                }
            });
        },
        toggle: () => {
            visible.update(!visible.value());
        },
        getUser: () => {
            return managers.backend.getUser();
        },
        getTheme: () => {
            return theme;
        }
    };
    return {
        element,
        controller
    };
}
exports.createElementAndController = createElementAndController;
;
