"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inject = void 0;
const bonsai_1 = require("@joelek/bonsai");
const components_1 = require("./components");
const managers_1 = require("./managers");
const client = require("../client");
;
function inject() {
    let managers = managers_1.Managers.create(client.createClient());
    let visible = (0, bonsai_1.stateify)(false);
    document.body.appendChild((0, components_1.Modal)(managers, { visible }));
    return {
        toggle: () => {
            visible.update(!visible.value());
        }
    };
}
exports.inject = inject;
;
