"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index = require("./index");
async function run() {
    let mailer = new index.SMTPMailer(index.loadConfig("./private/mailer.json"));
    return mailer.send({
        subject: "Subject",
        message: "Message"
    });
}
;
run();
