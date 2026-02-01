import * as wtf from "@joelek/wtf";
import * as store from "./store";

wtf.test(`ObjectIndex should support lookups.`, async (assert) => {
	let index = new store.ObjectIndex([] as Array<{ id: string; value: number; }>, "id", "value");
	index.insert({
		id: "a",
		value: 1
	});
	index.insert({
		id: "b",
		value: 3
	});
	assert.equals(index.lookup("<", 0).map((object) => object.id), []);
	assert.equals(index.lookup("<", 1).map((object) => object.id), []);
	assert.equals(index.lookup("<", 2).map((object) => object.id), ["a"]);
	assert.equals(index.lookup("<", 3).map((object) => object.id), ["a"]);
	assert.equals(index.lookup("<", 4).map((object) => object.id), ["a", "b"]);
	assert.equals(index.lookup("<=", 0).map((object) => object.id), []);
	assert.equals(index.lookup("<=", 1).map((object) => object.id), ["a"]);
	assert.equals(index.lookup("<=", 2).map((object) => object.id), ["a"]);
	assert.equals(index.lookup("<=", 3).map((object) => object.id), ["a", "b"]);
	assert.equals(index.lookup("<=", 4).map((object) => object.id), ["a", "b"]);
	assert.equals(index.lookup("==", 0).map((object) => object.id), []);
	assert.equals(index.lookup("==", 1).map((object) => object.id), ["a"]);
	assert.equals(index.lookup("==", 2).map((object) => object.id), []);
	assert.equals(index.lookup("==", 3).map((object) => object.id), ["b"]);
	assert.equals(index.lookup("==", 4).map((object) => object.id), []);
	assert.equals(index.lookup("!=", 0).map((object) => object.id), ["a", "b"]);
	assert.equals(index.lookup("!=", 1).map((object) => object.id), ["b"]);
	assert.equals(index.lookup("!=", 2).map((object) => object.id), ["a", "b"]);
	assert.equals(index.lookup("!=", 3).map((object) => object.id), ["a"]);
	assert.equals(index.lookup("!=", 4).map((object) => object.id), ["a", "b"]);
	assert.equals(index.lookup(">", 0).map((object) => object.id), ["a", "b"]);
	assert.equals(index.lookup(">", 1).map((object) => object.id), ["b"]);
	assert.equals(index.lookup(">", 2).map((object) => object.id), ["b"]);
	assert.equals(index.lookup(">", 3).map((object) => object.id), []);
	assert.equals(index.lookup(">", 4).map((object) => object.id), []);
	assert.equals(index.lookup(">=", 0).map((object) => object.id), ["a", "b"]);
	assert.equals(index.lookup(">=", 1).map((object) => object.id), ["a", "b"]);
	assert.equals(index.lookup(">=", 2).map((object) => object.id), ["b"]);
	assert.equals(index.lookup(">=", 3).map((object) => object.id), ["b"]);
	assert.equals(index.lookup(">=", 4).map((object) => object.id), []);
});

type Properties = {
	required_boolean: boolean;
	required_string: string,
	required_number: number;
	required_enum: "one" | "two";
	optional_boolean?: boolean | null;
	optional_string?: string | null,
	optional_number?: number | null;
	optional_enum?: "one" | "two" | null;
};

wtf.test(`Filter should support typed filters.`, async (assert) => {
	let filter1: store.LookupWhere<Properties, "id"> = {
		key: "required_boolean",
		operator: "==",
		operand: false
	};
	let filter2: store.LookupWhere<Properties, "id"> = {
		key: "required_string",
		operator: "==",
		operand: ""
	};
	let filter3: store.LookupWhere<Properties, "id"> = {
		key: "required_number",
		operator: "==",
		operand: 0
	};
	let filter4: store.LookupWhere<Properties, "id"> = {
		key: "required_enum",
		operator: "==",
		operand: "one"
	};
	let filter5: store.LookupWhere<Properties, "id"> = {
		key: "optional_boolean",
		operator: "==",
		operand: null
	};
	let filter6: store.LookupWhere<Properties, "id"> = {
		key: "optional_string",
		operator: "==",
		operand: null
	};
	let filter7: store.LookupWhere<Properties, "id"> = {
		key: "optional_number",
		operator: "==",
		operand: null
	};
	let filter8: store.LookupWhere<Properties, "id"> = {
		key: "optional_enum",
		operator: "==",
		operand: null
	};
	let filter9: store.LookupWhere<Properties, "id"> = {
		not: {
			key: "id",
			operator: "==",
			operand: ""
		}
	};
});
