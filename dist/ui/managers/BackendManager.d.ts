import { State } from "@joelek/bonsai";
import * as api from "../../api/client";
export declare class BackendManager implements api.Client {
    protected client: api.Client;
    protected language: State<api.Language>;
    protected state: State<api.State | undefined>;
    protected user: State<api.User | undefined>;
    protected lock: Promise<any>;
    protected editable: State<boolean>;
    protected submittable: State<boolean>;
    protected waitForBackend(wait_until_utc: number): Promise<void>;
    constructor(client: api.Client, language: State<api.Language>);
    readState(...args: Parameters<api.Client["readState"]>): ReturnType<api.Client["readState"]>;
    sendCommand(...args: Parameters<api.Client["sendCommand"]>): ReturnType<api.Client["sendCommand"]>;
    getEditable(): State<boolean>;
    getSubmittable(): State<boolean>;
    getState(): State<api.State | undefined>;
    getUser(): State<api.User | undefined>;
}
