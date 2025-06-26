import { OriginProperties } from "../objects";
import { Object, ObjectStore, VolatileObjectStore } from "./store";

export const UNIQUE_ORIGIN_PROPERTIES = (<A extends PropertyKey[]>(...values: A) => values)(
	"address"
);

export type Origin = Object<OriginProperties>

export interface OriginStore extends ObjectStore<OriginProperties> {};

export class VolatileOriginStore extends VolatileObjectStore<OriginProperties, typeof UNIQUE_ORIGIN_PROPERTIES> {
	constructor() {
		super(UNIQUE_ORIGIN_PROPERTIES);
	}
};
