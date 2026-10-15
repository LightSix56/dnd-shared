#!/usr/bin/env python3
"""Собирает data/spells.json: заклинания листа (dnd.su) + боевые параметры мастера.

Запуск: python3 scripts/build-spells.py <путь к dnd5e-character-sheet> <путь к dnd-ai-master>
Слияние идёт по английскому названию; для SRD-заклинаний с другим названием есть таблица ALIASES.
"""
import glob
import json
import sys

ALIASES = {
    "acid arrow": "melf's acid arrow",
    "arcane hand": "bigby's hand",
    "arcane sword": "mordenkainen's sword",
    "arcanist's magic aura": "nystul's magic aura",
    "black tentacles": "evard's black tentacles",
    "faithful hound": "mordenkainen's faithful hound",
    "floating disk": "tenser's floating disk",
    "freezing sphere": "otiluke's freezing sphere",
    "hideous laughter": "tasha's hideous laughter",
    "instant summons": "drawmij's instant summons",
    "irresistible dance": "otto's irresistible dance",
    "magnificent mansion": "mordenkainen's magnificent mansion",
    "private sanctum": "mordenkainen's private sanctum",
    "resilient sphere": "otiluke's resilient sphere",
    "secret chest": "leomund's secret chest",
    "telepathic bond": "rary's telepathic bond",
    "tiny hut": "leomund's tiny hut",
}


def key(name: str) -> str:
    return name.lower().replace("’", "'").strip()


def load_sheet(root: str) -> list[dict]:
    out = []
    for f in sorted(glob.glob(root + "/src/data/compendium/spells/*.ts")):
        if f.endswith(("index.ts", "types.ts")):
            continue
        s = open(f, encoding="utf-8").read()
        i = s.index("= [") + 2
        j = s.rindex("];") + 1
        out.extend(json.loads(s[i:j]))
    return out


def main(sheet_root: str, master_root: str) -> None:
    spells = load_sheet(sheet_root)
    by_key = {key(s["nameEn"]): s for s in spells}
    base = master_root + "/src/lib/combat"
    sources = [
        ("srd", json.load(open(base + "/srd/data/spells.json", encoding="utf-8"))),
        ("expanded", json.load(open(base + "/data/expanded-combat-spells.json", encoding="utf-8"))),
    ]
    unmatched = []
    for label, rows in sources:
        for order, r in enumerate(rows):
            k = key(r["nameEn"])
            k = key(ALIASES.get(k, k))
            target = by_key.get(k)
            if not target:
                unmatched.append(r["nameEn"])
                continue
            # SRD сначала, расширенные перекрывают: у них точнее параметры
            target["combat"] = r["parameters"]
            target["combatSource"] = label
            # поля записи мастера как были: нужны, чтобы сайт мастера работал без изменений поведения
            target["masterRecord"] = {
                **{k: v for k, v in r.items() if k != "parameters"},
                "order": order,
            }
            # старые id мастера сохраняем, чтобы ссылки на них не терялись
            target.setdefault("legacyIds", []).append(r["id"])
            if key(r["nameEn"]) != key(target["nameEn"]):
                target.setdefault("aliasesEn", []).append(r["nameEn"])
    if unmatched:
        print("Не нашлись в листе:", unmatched)
    spells.sort(key=lambda s: (s["level"], s["nameEn"].lower()))
    with open("data/spells.json", "w", encoding="utf-8") as f:
        json.dump(spells, f, ensure_ascii=False, indent=1)
    with_combat = sum(1 for s in spells if "combat" in s)
    print(f"Заклинаний: {len(spells)}, с боевыми параметрами: {with_combat}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
