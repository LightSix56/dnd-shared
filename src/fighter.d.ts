export interface FighterDataOption {
  id: string;
  name: string;
  description: string;
}

export interface FighterDataFeature {
  id: string;
  subclassId: string;
  subclass: string;
  level: number;
  name: string;
  description: string;
  source: string;
  options: FighterDataOption[];
}

export interface FighterData {
  _note: string;
  source: { site: string; edition: string };
  subclasses: { id: string; name: string }[];
  features: FighterDataFeature[];
}

export const FIGHTER_DATA: FighterData;
