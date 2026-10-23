"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMTPMailer = exports.UnsupportedAuthenticationMethodError = exports.UnexpectedStateError = exports.UnexpectedResponseError = exports.HandshakeTimeoutError = exports.ConnectionTimeoutError = exports.MissingReplyAddressError = exports.MissingFromAddressError = exports.MissingToAddressError = exports.loadConfig = exports.TestMailer = exports.performTLSHandshake = exports.split = exports.getUniqueMailboxes = exports.encodeMailboxes = exports.encodeMailbox = exports.encode = exports.EXPLICIT_TLS_PORT = exports.IMPLICIT_TLS_PORT = void 0;
const libcrypto = require("crypto");
const libfs = require("fs");
const libnet = require("net");
const libtls = require("tls");
const config_1 = require("./config");
exports.IMPLICIT_TLS_PORT = 465;
exports.EXPLICIT_TLS_PORT = 587;
function encode(string) {
    if (/^([\x09\x0A\x0D\x20-\x7E]*)$/.test(string)) {
        return string;
    }
    else {
        return `=?UTF-8?B?${Buffer.from(string).toString("base64")}?=`;
    }
}
exports.encode = encode;
;
function encodeMailbox(mailbox) {
    if (mailbox.name != null) {
        return `${encode(mailbox.name)} <${mailbox.address}>`;
    }
    else {
        return `<${mailbox.address}>`;
    }
}
exports.encodeMailbox = encodeMailbox;
;
function encodeMailboxes(mailboxes) {
    return mailboxes.map(encodeMailbox).join(", ");
}
exports.encodeMailboxes = encodeMailboxes;
;
function getUniqueMailboxes(mailboxes) {
    let addresses = new Set();
    return mailboxes.filter((mailbox) => {
        if (addresses.has(mailbox.address)) {
            return false;
        }
        else {
            addresses.add(mailbox.address);
            return true;
        }
    });
}
exports.getUniqueMailboxes = getUniqueMailboxes;
;
function split(string, max_length) {
    let parts = [];
    for (let index = 0; index < string.length; index += max_length) {
        parts.push(string.slice(index, index + max_length));
    }
    return parts;
}
exports.split = split;
;
function performTLSHandshake(net_socket, servername, timeout_seconds) {
    return new Promise((resolve, reject) => {
        let tls_socket = libtls.connect({
            socket: net_socket,
            servername: servername,
            rejectUnauthorized: true
        });
        let timeout = setTimeout(() => {
            tls_socket.destroy(new HandshakeTimeoutError(timeout_seconds));
        }, timeout_seconds * 1000);
        tls_socket.once("error", (error) => {
            clearTimeout(timeout);
            reject(error);
        });
        tls_socket.once("secureConnect", () => {
            clearTimeout(timeout);
            resolve(tls_socket);
        });
    });
}
exports.performTLSHandshake = performTLSHandshake;
;
;
class TestMailer {
    constructor() { }
    async send(options) {
        console.log(options);
    }
}
exports.TestMailer = TestMailer;
;
function loadConfig(config) {
    let string = libfs.readFileSync(config, "utf-8");
    let json = JSON.parse(string);
    return config_1.MailerOptions.as(json);
}
exports.loadConfig = loadConfig;
;
class MissingToAddressError extends Error {
    constructor() {
        super();
    }
    get message() {
        return `Expected to address to be specified!`;
    }
}
exports.MissingToAddressError = MissingToAddressError;
;
class MissingFromAddressError extends Error {
    constructor() {
        super();
    }
    get message() {
        return `Expected from address to be specified!`;
    }
}
exports.MissingFromAddressError = MissingFromAddressError;
;
class MissingReplyAddressError extends Error {
    constructor() {
        super();
    }
    get message() {
        return `Expected reply address to be specified!`;
    }
}
exports.MissingReplyAddressError = MissingReplyAddressError;
;
class ConnectionTimeoutError extends Error {
    timeout_seconds;
    constructor(timeout_seconds) {
        super();
        this.timeout_seconds = timeout_seconds;
    }
    get message() {
        return `Expected TCP connection to succeed within ${this.timeout_seconds} seconds!`;
    }
}
exports.ConnectionTimeoutError = ConnectionTimeoutError;
;
class HandshakeTimeoutError extends Error {
    timeout_seconds;
    constructor(timeout_seconds) {
        super();
        this.timeout_seconds = timeout_seconds;
    }
    get message() {
        return `Expected TLS handshake to complete within ${this.timeout_seconds} seconds!`;
    }
}
exports.HandshakeTimeoutError = HandshakeTimeoutError;
;
class UnexpectedResponseError extends Error {
    state;
    lines;
    constructor(state, lines) {
        super();
        this.state = state;
        this.lines = lines;
    }
    get message() {
        return `Expected a different response for state ${this.state}!`;
    }
}
exports.UnexpectedResponseError = UnexpectedResponseError;
;
class UnexpectedStateError extends Error {
    state;
    constructor(state) {
        super();
        this.state = state;
    }
    get message() {
        return `Expected a different state than "${this.state}"!`;
    }
}
exports.UnexpectedStateError = UnexpectedStateError;
;
class UnsupportedAuthenticationMethodError extends Error {
    methods;
    constructor(methods) {
        super();
        this.methods = methods;
    }
    get message() {
        return `Expected a supported authentication method!`;
    }
}
exports.UnsupportedAuthenticationMethodError = UnsupportedAuthenticationMethodError;
;
class SMTPMailer {
    options;
    generateMessageIDAddress(from_address) {
        let id = libcrypto.randomBytes(16).toString("hex");
        return `${id}@${from_address.slice(from_address.indexOf("@") + 1)}`;
    }
    getMailboxes(value) {
        let mailboxes = new Array();
        if (value != null) {
            if (Array.isArray(value)) {
                mailboxes.push(...value);
            }
            else {
                mailboxes.push(value);
            }
        }
        return getUniqueMailboxes(mailboxes);
    }
    getTlsOption() {
        let smtp = this.options.smtp;
        if (smtp.tls != null) {
            return smtp.tls;
        }
        if (smtp.port === exports.EXPLICIT_TLS_PORT) {
            return "EXPLICIT";
        }
        if (smtp.port === exports.IMPLICIT_TLS_PORT) {
            return "IMPLICIT";
        }
        return "IMPLICIT";
    }
    getLoginMethods(lines) {
        let methods = new Array();
        for (let line of lines) {
            if (line.startsWith("250-AUTH ")) {
                methods.push(...line.slice("250-AUTH ".length).split(" "));
            }
        }
        return methods;
    }
    finishSending(options, tls_socket, state) {
        let to = this.getMailboxes(options.to ?? this.options.defaults?.to);
        if (to.length === 0) {
            throw new MissingToAddressError();
        }
        let from = this.getMailboxes(options.from ?? this.options.defaults?.from);
        if (from.length === 0) {
            throw new MissingFromAddressError();
        }
        let reply = this.getMailboxes(options.reply ?? this.options.defaults?.reply);
        if (reply.length === 0) {
            throw new MissingReplyAddressError();
        }
        let cc = this.getMailboxes(options.cc ?? this.options.defaults?.cc);
        let bcc = this.getMailboxes(options.bcc ?? this.options.defaults?.bcc);
        let attachments = options.attachments ?? [];
        let sender = from[0];
        let recipients = getUniqueMailboxes([...to, ...cc, ...bcc]);
        return new Promise((resolve, reject) => {
            let recipient_index = 0;
            let ondata = (buffer) => {
                try {
                    let lines = buffer.toString("ascii").split("\r\n");
                    console.log(state, lines);
                    if (state === "WAITING_FOR_EHLO_REPLY") {
                        if (lines[0].startsWith("250")) {
                            let methods = this.getLoginMethods(lines);
                            if (methods.includes("PLAIN")) {
                                tls_socket.write(`AUTH PLAIN ${Buffer.from("\0" + this.options.smtp.username + "\0" + this.options.smtp.password).toString("base64")}\r\n`);
                                state = "WAITING_FOR_AUTH_PLAIN_REPLY";
                            }
                            else if (methods.includes("LOGIN")) {
                                tls_socket.write(`AUTH LOGIN\r\n`);
                                state = "WAITING_FOR_AUTH_LOGIN_REPLY";
                            }
                            else {
                                throw new UnsupportedAuthenticationMethodError(methods);
                            }
                        }
                        else {
                            throw new UnexpectedResponseError(state, lines);
                        }
                    }
                    else if (state === "WAITING_FOR_AUTH_PLAIN_REPLY") {
                        if (lines[0].startsWith("235")) {
                            tls_socket.write(`MAIL FROM: <${sender.address}>\r\n`);
                            state = "WAITING_FOR_MAIL_REPLY";
                        }
                        else {
                            throw new UnexpectedResponseError(state, lines);
                        }
                    }
                    else if (state === "WAITING_FOR_AUTH_LOGIN_REPLY") {
                        if (lines[0].startsWith("334")) {
                            if (lines[0] === `334 ${Buffer.from("Username:").toString("base64")}`) {
                                tls_socket.write(`${Buffer.from(this.options.smtp.username).toString("base64")}\r\n`);
                                state = "WAITING_FOR_AUTH_LOGIN_REPLY";
                            }
                            else if (lines[0] === `334 ${Buffer.from("Password:").toString("base64")}`) {
                                tls_socket.write(`${Buffer.from(this.options.smtp.password).toString("base64")}\r\n`);
                                state = "WAITING_FOR_AUTH_LOGIN_REPLY";
                            }
                            else {
                                throw new UnexpectedResponseError(state, lines);
                            }
                        }
                        else if (lines[0].startsWith("235")) {
                            tls_socket.write(`MAIL FROM: <${sender.address}>\r\n`);
                            state = "WAITING_FOR_MAIL_REPLY";
                        }
                        else {
                            throw new UnexpectedResponseError(state, lines);
                        }
                    }
                    else if (state === "WAITING_FOR_MAIL_REPLY") {
                        if (lines[0].startsWith("250")) {
                            let recipient = recipients.at(recipient_index++);
                            if (recipient != null) {
                                tls_socket.write(`RCPT TO: <${recipient.address}>\r\n`);
                                state = "WAITING_FOR_RCPT_REPLY";
                            }
                            else {
                                tls_socket.write(`DATA\r\n`);
                                state = "WAITING_FOR_DATA_REPLY";
                            }
                        }
                        else {
                            throw new UnexpectedResponseError(state, lines);
                        }
                    }
                    else if (state === "WAITING_FOR_RCPT_REPLY") {
                        if (lines[0].startsWith("250")) {
                            let recipient = recipients.at(recipient_index++);
                            if (recipient != null) {
                                tls_socket.write(`RCPT TO: <${recipient.address}>\r\n`);
                                state = "WAITING_FOR_RCPT_REPLY";
                            }
                            else {
                                tls_socket.write(`DATA\r\n`);
                                state = "WAITING_FOR_DATA_REPLY";
                            }
                        }
                        else {
                            throw new UnexpectedResponseError(state, lines);
                        }
                    }
                    else if (state === "WAITING_FOR_DATA_REPLY") {
                        if (lines[0].startsWith("354")) {
                            let boundary = libcrypto.randomBytes(16).toString("hex");
                            let lines = [
                                `MIME-Version: 1.0`,
                                `Date: ${new Date().toUTCString()}`,
                                `Message-ID: <${this.generateMessageIDAddress(sender.address)}>`
                            ];
                            if (from.length > 0) {
                                lines.push(`From: ${encodeMailboxes(from)}`);
                            }
                            if (to.length > 0) {
                                lines.push(`To: ${encodeMailboxes(to)}`);
                            }
                            if (reply.length > 0) {
                                lines.push(`Reply-To: ${encodeMailboxes(reply)}`);
                            }
                            if (cc.length > 0) {
                                lines.push(`Cc: ${encodeMailboxes(cc)}`);
                            }
                            lines.push(`Subject: ${encode(options.subject)}`);
                            lines.push(`Content-Type: multipart/mixed; boundary=${boundary}`);
                            lines.push(``);
                            lines.push(`--${boundary}`);
                            lines.push(`Content-Type: ${options.html === true ? "text/html" : "text/plain"}; charset=utf-8`);
                            lines.push(`Content-Transfer-Encoding: base64`);
                            lines.push(``);
                            lines.push(...split(Buffer.from(options.message).toString("base64"), 76));
                            for (let attachment of attachments) {
                                lines.push(``);
                                lines.push(`--${boundary}`);
                                lines.push(`Content-Type: ${attachment.mime}; name=${attachment.filename}`);
                                lines.push(`Content-Transfer-Encoding: base64`);
                                lines.push(`Content-Disposition: attachment; filename=${attachment.filename}`);
                                lines.push(``);
                                lines.push(...split(Buffer.from(attachment.data).toString("base64"), 76));
                            }
                            lines.push(``);
                            lines.push(`--${boundary}--`);
                            lines.push(`.`);
                            for (let line of lines) {
                                tls_socket.write(`${line}\r\n`);
                            }
                            state = "WAITING_FOR_FINALIZATION";
                        }
                        else {
                            throw new UnexpectedResponseError(state, lines);
                        }
                    }
                    else if (state === "WAITING_FOR_FINALIZATION") {
                        if (lines[0].startsWith("250")) {
                            state = "FINISHED";
                            tls_socket.off("data", ondata);
                            tls_socket.write("QUIT\r\n");
                            tls_socket.destroy();
                            resolve();
                        }
                        else {
                            throw new UnexpectedResponseError(state, lines);
                        }
                    }
                    else {
                        throw new UnexpectedStateError(state);
                    }
                }
                catch (error) {
                    tls_socket.off("data", ondata);
                    tls_socket.write("QUIT\r\n");
                    tls_socket.destroy();
                    // NOTE: Handles ondata errors.
                    reject(error);
                }
            };
            tls_socket.on("data", ondata);
        });
    }
    sendExplicit(options) {
        let timeout_seconds = this.options.smtp.timeout_seconds ?? 10;
        let state = "WAITING_FOR_GREETING";
        return new Promise((resolve, reject) => {
            let net_socket = libnet.connect({
                host: this.options.smtp.hostname,
                port: this.options.smtp.port
            });
            let timeout = setTimeout(() => {
                net_socket.destroy(new ConnectionTimeoutError(timeout_seconds));
            }, timeout_seconds * 1000);
            net_socket.once("error", (error) => {
                clearTimeout(timeout);
                // NOTE: Handles host not being reachable as well as host being reachable but port being closed.
                reject(error);
            });
            net_socket.once("connect", () => {
                clearTimeout(timeout);
                let ondata = (buffer) => {
                    try {
                        let lines = buffer.toString("ascii").split("\r\n");
                        console.log(state, lines);
                        if (state === "WAITING_FOR_GREETING") {
                            if (lines[0].startsWith("220")) {
                                net_socket.write(`EHLO mail.example.com\r\n`);
                                state = "WAITING_FOR_EHLO_REPLY";
                            }
                            else {
                                throw new UnexpectedResponseError(state, lines);
                            }
                        }
                        else if (state === "WAITING_FOR_EHLO_REPLY") {
                            if (lines[0].startsWith("250")) {
                                net_socket.write(`STARTTLS\r\n`);
                                state = "WAITING_FOR_STARTTLS_REPLY";
                            }
                            else {
                                throw new UnexpectedResponseError(state, lines);
                            }
                        }
                        else if (state === "WAITING_FOR_STARTTLS_REPLY") {
                            if (lines[0].startsWith("220")) {
                                net_socket.off("data", ondata);
                                performTLSHandshake(net_socket, this.options.smtp.hostname, timeout_seconds)
                                    .then((tls_socket) => {
                                    tls_socket.write(`EHLO mail.example.com\r\n`);
                                    state = "WAITING_FOR_EHLO_REPLY";
                                    resolve(this.finishSending(options, tls_socket, state));
                                })
                                    .catch((error) => {
                                    // NOTE: Handles TLS handshake not completing successfully.
                                    reject(error);
                                });
                            }
                            else {
                                throw new UnexpectedResponseError(state, lines);
                            }
                        }
                        else {
                            throw new UnexpectedStateError(state);
                        }
                    }
                    catch (error) {
                        net_socket.off("data", ondata);
                        net_socket.write("QUIT\r\n");
                        net_socket.destroy();
                        // NOTE: Handles ondata errors.
                        reject(error);
                    }
                };
                net_socket.on("data", ondata);
            });
        });
    }
    sendImplicit(options) {
        let timeout_seconds = this.options.smtp.timeout_seconds ?? 10;
        let state = "WAITING_FOR_GREETING";
        return new Promise((resolve, reject) => {
            let net_socket = libnet.connect({
                host: this.options.smtp.hostname,
                port: this.options.smtp.port
            });
            let timeout = setTimeout(() => {
                net_socket.destroy(new ConnectionTimeoutError(timeout_seconds));
            }, timeout_seconds * 1000);
            net_socket.once("error", (error) => {
                clearTimeout(timeout);
                // NOTE: Handles host not being reachable as well as host being reachable but port being closed.
                reject(error);
            });
            net_socket.once("connect", async () => {
                clearTimeout(timeout);
                performTLSHandshake(net_socket, this.options.smtp.hostname, timeout_seconds)
                    .then((tls_socket) => {
                    let ondata = (buffer) => {
                        try {
                            let lines = buffer.toString("ascii").split("\r\n");
                            console.log(state, lines);
                            if (state === "WAITING_FOR_GREETING") {
                                if (lines[0].startsWith("220")) {
                                    tls_socket.off("data", ondata);
                                    tls_socket.write(`EHLO mail.example.com\r\n`);
                                    state = "WAITING_FOR_EHLO_REPLY";
                                    resolve(this.finishSending(options, tls_socket, state));
                                }
                                else {
                                    throw new UnexpectedResponseError(state, lines);
                                }
                            }
                            else {
                                throw new UnexpectedStateError(state);
                            }
                        }
                        catch (error) {
                            tls_socket.off("data", ondata);
                            tls_socket.write("QUIT\r\n");
                            tls_socket.destroy();
                            // NOTE: Handles ondata errors.
                            reject(error);
                        }
                    };
                    tls_socket.on("data", ondata);
                })
                    .catch((error) => {
                    // NOTE: Handles TLS handshake not completing successfully.
                    reject(error);
                });
            });
        });
    }
    constructor(options) {
        this.options = {
            ...options,
            smtp: {
                ...options.smtp
            },
            defaults: {
                ...options.defaults
            }
        };
    }
    send(options) {
        let tls = this.getTlsOption();
        if (tls === "IMPLICIT") {
            return this.sendImplicit(options);
        }
        else {
            return this.sendExplicit(options);
        }
    }
    ;
}
exports.SMTPMailer = SMTPMailer;
;
