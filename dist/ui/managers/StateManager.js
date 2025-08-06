"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateManager = void 0;
const bonsai_1 = require("@joelek/bonsai");
exports.StateManager = {
    create() {
        let visible = (0, bonsai_1.stateify)(false);
        let theme = (0, bonsai_1.stateify)("light");
        return {
            visible,
            theme
        };
    }
};
