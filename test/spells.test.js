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
