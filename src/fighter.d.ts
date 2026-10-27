export interface FighterDataFeature {
  id: string;
  subclassId: string;
  subclass: string;
  level: number;
  name: string;
  description: string;
  [key: string]: unknown;
}

export interface FighterData {
  _note: string;
  source: { site: string; edition: string };
  subclasses: { id: string; name: string }[];
  features: FighterDataFeature[];
}

export const FIGHTER_DATA: FighterData;
