import { UserProperties } from "../objects";
import { Object, ObjectStore, VolatileObjectStore } from "./store";

export const UNIQUE_USER_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)(
	"email",
	"username"
);

export type User = Object<UserProperties>

export interface UserStore extends ObjectStore<UserProperties> {};

export class VolatileUserStore extends VolatileObjectStore<UserProperties, typeof UNIQUE_USER_PROPERTIES> {
	constructor() {
		super(UNIQUE_USER_PROPERTIES);
	}
};
