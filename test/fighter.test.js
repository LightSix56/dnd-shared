import test from "node:test";
import assert from "node:assert/strict";
import { FIGHTER_DATA } from "../src/fighter.js";

test("10 официальных подклассов Воина (2014)", () => {
  assert.equal(FIGHTER_DATA.subclasses.length, 10);
  assert.equal(FIGHTER_DATA.source.edition, "2014");
});

test("у каждого умения есть id, подкласс из списка, уровень и описание", () => {
  const ids = new Set(FIGHTER_DATA.subclasses.map((s) => s.id));
  assert.equal(FIGHTER_DATA.features.length, 56);
  for (const f of FIGHTER_DATA.features) {
    assert.ok(f.id && f.name && f.description, f.name);
    assert.ok(ids.has(f.subclassId), f.id);
    assert.ok(f.level >= 3 && f.level <= 20, f.id);
  }
});
