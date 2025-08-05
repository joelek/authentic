import { Managers } from "../../managers/Managers";
import { FormButton } from "../form/FormButton";
import { Icon } from "../Icon";
export type IconButton = FormButton & {
    graphic: Icon["graphic"];
};
export declare function IconButton(managers: Managers, { graphic, ...rest }: IconButton): import("@joelek/bonsai").FunctionalElement<HTMLElementEventMap, HTMLButtonElement>;
