import { State } from "@joelek/bonsai";
import * as api from "../../api/client";
export declare class BackendManager implements api.Client {
    protected client: api.Client;
    protected state: State<api.State | undefined>;
    protected wait_until_utc: number;
    protected pending: State<boolean>;
    protected waitForPending(): Promise<void>;
    protected waitForBackend(): Promise<void>;
    protected wait(): Promise<void>;
    constructor(client: api.Client);
    readState(...args: Parameters<api.Client["readState"]>): ReturnType<api.Client["readState"]>;
    sendCommand(...args: Parameters<api.Client["sendCommand"]>): ReturnType<api.Client["sendCommand"]>;
    getPending(): State<boolean>;
    getState(): State<api.State | undefined>;
}
