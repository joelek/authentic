"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wtf = require("@joelek/wtf");
const server = require("../server");
const mariadb = require("./mariadb");
const objects = require("./objects");
for (let operator of [">", ">=", "==", "!=", "<", "<="]) {
    for (let sort of ["ASC", "DESC"]) {
        wtf.test(`Stores should support integer lookup filters for operator ${operator} and sort ${sort}.`, async (assert) => {
            let store = new server.stores.store.VolatileObjectStore("object_id", [], objects.Object, {});
            for (let object of await mariadb.OBJECTS.lookupObjects()) {
                store.createObject(object);
            }
            let expected = await store.lookupObjects({
                where: {
                    key: "optional_integer",
                    operator: operator,
                    operand: 5
                },
                order: {
                    keys: ["optional_integer", "object_id"],
                    sort: sort
                }
            });
            let observed = [];
            while (true) {
                let objects = await mariadb.OBJECTS.lookupObjects({
                    where: {
                        key: "optional_integer",
                        operator: operator,
                        operand: 5
                    },
                    order: {
                        keys: ["optional_integer", "object_id"],
                        sort: sort
                    },
                    anchor: observed[observed.length - 1]?.object_id,
                    length: 1
                });
                if (objects.length === 0) {
                    break;
                }
                observed.push(...objects);
            }
            assert.equals(observed, expected);
        });
    }
}
