"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateManager = void 0;
const bonsai_1 = require("@joelek/bonsai");
exports.StateManager = {
    create() {
        let visible = (0, bonsai_1.stateify)(false);
        let passwords = (0, bonsai_1.stateify)("hide");
        let theme = (0, bonsai_1.stateify)("light");
        let modal_transition = (0, bonsai_1.stateify)(false);
        window.addEventListener("keyup", (event) => {
            if (event.key === "Escape") {
                visible.update(false);
            }
        });
        return {
            visible,
            passwords,
            theme,
            modal_transition
        };
    }
};
