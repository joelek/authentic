import * as wtf from "@joelek/wtf";
import * as store from "./store";

wtf.test(`ObjectIndex should support lookups.`, async (assert) => {
	let index = new store.ObjectIndex([] as Array<{ id: string; value: number; }>, "value");
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
	assert.equals(index.lookup("=", 0).map((object) => object.id), []);
	assert.equals(index.lookup("=", 1).map((object) => object.id), ["a"]);
	assert.equals(index.lookup("=", 2).map((object) => object.id), []);
	assert.equals(index.lookup("=", 3).map((object) => object.id), ["b"]);
	assert.equals(index.lookup("=", 4).map((object) => object.id), []);
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
