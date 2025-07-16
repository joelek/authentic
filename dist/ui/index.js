"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createElementAndController = void 0;
const bonsai_1 = require("@joelek/bonsai");
const client_1 = require("../client");
const Modal_1 = require("./components/Modal");
const managers_1 = require("./managers");
document.head.appendChild(bonsai_1.html.style({}, `
	:root {
		--authentic-accent-color: rgb(223, 159, 31);
		--authentic-accent-color-bright: rgb(239, 175, 47);
	}
`));
;
function createElementAndController(options) {
    let client = options?.client ?? (0, client_1.createClient)();
    let managers = managers_1.Managers.create(client);
    let element = (0, Modal_1.Modal)(managers, {});
    let visible = managers.state.visible;
    let controller = {
        logout: async () => {
            await managers.backend.sendCommand({
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
        }
    };
    return {
        element,
        controller
    };
}
exports.createElementAndController = createElementAndController;
;
