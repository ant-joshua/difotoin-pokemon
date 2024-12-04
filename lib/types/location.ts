export interface LocationDetail {
  encounter_method_rates: EncounterMethodRate[];
  game_index: number;
  id: number;
  location: Location;
  name: string;
  names: Name[];
  pokemon_encounters: PokemonEncounter[];
}

export interface EncounterMethodRate {
  encounter_method: Location;
  version_details: EncounterMethodRateVersionDetail[];
}

export interface Location {
  name: string;
  url: string;
}

export interface EncounterMethodRateVersionDetail {
  rate: number;
  version: Location;
}

export interface Name {
  language: Location;
  name: string;
}

export interface PokemonEncounter {
  pokemon: Location;
  version_details: PokemonEncounterVersionDetail[];
}

export interface PokemonEncounterVersionDetail {
  encounter_details: EncounterDetail[];
  max_chance: number;
  version: Location;
}

export interface EncounterDetail {
  chance: number;
  condition_values: Location[];
  max_level: number;
  method: Location;
  min_level: number;
}
