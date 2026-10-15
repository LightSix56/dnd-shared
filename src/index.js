import spells from "../data/spells.json" with { type: "json" };

export const SPELLS = spells;

const norm = (s) => String(s).toLowerCase().replace(/’/g, "'").trim();
const byEn = new Map(spells.flatMap((s) => [[norm(s.nameEn), s], ...(s.aliasesEn ?? []).map((n) => [norm(n), s])]));
const byRu = new Map(spells.map((s) => [norm(s.name), s]));
const byLegacy = new Map(spells.flatMap((s) => (s.legacyIds ?? []).map((id) => [id, s])));

/** Заклинание по английскому названию, русскому названию, id листа или старому id мастера */
export function findSpell(query) {
  const q = norm(query);
  return byEn.get(q) ?? byRu.get(q) ?? spells.find((s) => s.id === query) ?? byLegacy.get(query);
}
