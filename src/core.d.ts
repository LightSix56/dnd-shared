import type { Spell } from "./index";

export type CoreSpell = Omit<Spell, "combat" | "combatSource" | "masterRecord">;
export const CORE_SPELLS: CoreSpell[];
