import { RoleProperties } from "../objects";
import { Object, ObjectStore, VolatileObjectStore } from "./store";

export const UNIQUE_ROLE_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)(

);

export type Role = Object<RoleProperties>

export interface RoleStore extends ObjectStore<RoleProperties> {};

export class VolatileRoleStore extends VolatileObjectStore<RoleProperties, typeof UNIQUE_ROLE_PROPERTIES> {
	constructor() {
		super(UNIQUE_ROLE_PROPERTIES);
	}
};
