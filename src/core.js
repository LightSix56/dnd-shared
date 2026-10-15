// Лёгкая версия для сайта листа: заклинания без боевых параметров (в сборку клиента не попадают лишние данные)
import spells from "../data/spells-core.json" with { type: "json" };

export const CORE_SPELLS = spells;
