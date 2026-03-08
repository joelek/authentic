import * as autoguard from "@joelek/autoguard";
import * as prequel from "@joelek/prequel";
import { UserProperties } from "../objects";

export const UNIQUE_USER_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)(
	"email",
	"username"
);

export type User = prequel.stores.Object<UserProperties, "user_id">;

export interface UserStore extends prequel.stores.ObjectStore<UserProperties, "user_id"> {};

export class VolatileUserStore extends prequel.stores.VolatileObjectStore<UserProperties, "user_id"> {
	constructor() {
		super("user_id", UNIQUE_USER_PROPERTIES, User);
	}
};

export const User = autoguard.guards.Intersection.of(
	autoguard.guards.Object.of({
		user_id: autoguard.guards.String
	}),
	UserProperties
);

export class DatabaseUserStore extends prequel.stores.DatabaseObjectStore<UserProperties, "user_id"> {
	constructor(detail: prequel.stores.DatabaseObjectStoreDetail, table: string) {
		super(detail, table, "user_id", User);
	}
};
