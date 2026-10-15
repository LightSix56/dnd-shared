export interface SpellCombatParameters {
  name: string;
  type: string;
  level: number;
  school: string;
  actionCost: string;
  range?: { type: string; value?: number };
  damage?: unknown;
  targeting?: unknown;
  concentration?: boolean;
  duration?: unknown;
  description?: string;
  [key: string]: unknown;
}

export interface Spell {
  /** id листа, например "1-hellish-rebuke" */
  id: string;
  name: string;
  nameEn: string;
  level: number;
  school: string;
  schoolEn: string;
  castingTime: string;
  range: string;
  components: { v: boolean; s: boolean; m: string; raw: string };
  duration: string;
  concentration: boolean;
  ritual: boolean;
  damage: string;
  damageType: string;
  save: string;
  classes: string[];
  optionalClasses: string[];
  subclasses: { name: string; class: string; raw: string }[];
  sources: { code: string; name: string }[];
  sourceBook: string;
  description: string;
  higherLevels: string;
  dndsuUrl: string;
  /** параметры для боевого движка; есть не у всех заклинаний */
  combat?: SpellCombatParameters;
  combatSource?: "srd" | "expanded";
  /** прежние id сайта мастера (srd / spell_exp_N) */
  legacyIds?: string[];
  /** прежние английские названия сайта мастера, если они отличались (например "Acid Arrow") */
  aliasesEn?: string[];
}

export const SPELLS: Spell[];
export function findSpell(query: string): Spell | undefined;
