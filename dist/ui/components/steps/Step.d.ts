import { Children, State } from "@joelek/bonsai";
import * as api from "../../../api/client";
import { Managers } from "../../managers/Managers";
export type Step<A extends api.State> = {
    type: State<A["type"] | undefined>;
    reason: State<A["reason"] | undefined>;
    ontransition?: (state: "start" | "end") => void;
};
export declare function Step<A extends api.State>(managers: Managers, attributes: Step<A>, ...children: Children): import("@joelek/bonsai").FunctionalElement<HTMLElementEventMap, HTMLDivElement>;
