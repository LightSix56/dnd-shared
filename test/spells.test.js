import test from "node:test";
import assert from "node:assert/strict";
import { SPELLS, findSpell } from "../src/index.js";

test("в библиотеке 525 заклинаний с уникальными id", () => {
  assert.equal(SPELLS.length, 525);
  assert.equal(new Set(SPELLS.map((s) => s.id)).size, SPELLS.length);
});

test("у каждого заклинания есть русское и английское название, уровень и описание", () => {
  for (const s of SPELLS) {
    assert.ok(s.name && s.nameEn, s.id);
    assert.ok(Number.isInteger(s.level) && s.level >= 0 && s.level <= 9, s.id);
    assert.ok(s.description, s.id);
  }
});

test("боевые параметры есть у 502 заклинаний мастера", () => {
  assert.equal(SPELLS.filter((s) => s.combat).length, 502);
});

test("поиск по английскому, русскому названию, id листа и старому id мастера", () => {
  const fb = findSpell("Fireball");
  assert.ok(fb?.combat);
  assert.equal(findSpell(fb.name), fb);
  assert.equal(findSpell(fb.id), fb);
  assert.equal(findSpell(fb.legacyIds[0]), fb);
});

test("SRD-заклинания с другим названием находятся (Acid Arrow = Melf's Acid Arrow)", () => {
  assert.equal(findSpell("Acid Arrow"), findSpell("Melf's Acid Arrow"));
  assert.ok(findSpell("Acid Arrow").combat);
});

test("masterRecord есть у каждого заклинания с боевыми параметрами и номера не повторяются", () => {
  const withCombat = SPELLS.filter((s) => s.combat);
  assert.ok(withCombat.every((s) => s.masterRecord && s.legacyIds?.length === 1));
  for (const src of ["srd", "expanded"]) {
    const orders = withCombat.filter((s) => s.combatSource === src).map((s) => s.masterRecord.order);
    assert.equal(new Set(orders).size, orders.length);
  }
});

test("порядок записей — как в компендиуме листа: сначала заговоры, затем уровни по возрастанию", () => {
  const levels = SPELLS.map((s) => s.level);
  assert.deepEqual(levels, [...levels].sort((a, b) => a - b));
});

test("лёгкая версия для листа: те же заклинания в том же порядке, без боевых полей", async () => {
  const { CORE_SPELLS } = await import("../src/core.js");
  assert.deepEqual(CORE_SPELLS.map((s) => s.id), SPELLS.map((s) => s.id));
  assert.ok(CORE_SPELLS.every((s) => !("combat" in s) && !("masterRecord" in s) && !("combatSource" in s)));
});
