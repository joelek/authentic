"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectUserInterface = void 0;
const bonsai_1 = require("@joelek/bonsai");
const client_1 = require("../client");
const components_1 = require("./components");
const managers_1 = require("./managers");
;
function injectUserInterface(options) {
    let client = options?.client ?? (0, client_1.createClient)();
    let managers = managers_1.Managers.create(client);
    let visible = (0, bonsai_1.stateify)(false);
    document.body.appendChild((0, components_1.Modal)(managers, { visible }));
    return {
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
}
exports.injectUserInterface = injectUserInterface;
;
