import {
  EncounterMethodRate,
  Location,
  PokemonEncounter,
} from "../types/location";

/**
 * Morning  4:00 AM–9:59 AM,
 * Day 10:00 AM–5:59 PM,
 * Night 6:00 PM–3:59 AM,
 *
 * @param hour
 */
export const pokemonTime = (
  hour: number
): "time-morning" | "time-day" | "time-night" => {
  if (hour >= 4 && hour < 10) {
    return "time-morning";
  } else if (hour >= 10 && hour < 18) {
    return "time-day";
  } else {
    return "time-night";
  }
};

type GachaResult = {
  pokemon: Location;
  version: Location;
  level: number;
  gender: "Male" | "Female";
};

export const applyGachaFormula = (
  pokemonData: PokemonEncounter[],
  encounterMethods: EncounterMethodRate[],
  selectedMethod?: string
): GachaResult | null => {
  const currentHour = new Date().getHours();
  const currentPokemonTime = pokemonTime(currentHour);

  // Get rates for the selected method
  const methodRates = encounterMethods
    .filter(
      (method) =>
        !selectedMethod || method.encounter_method.name === selectedMethod
    )
    .flatMap((method) =>
      method.version_details.map((versionDetail) => ({
        method: method.encounter_method.name,
        version: versionDetail.version.name,
        rate: versionDetail.rate,
      }))
    );

  // Calculate total method rate for determining no encounters
  const totalMethodRate = methodRates.reduce(
    (sum, method) => sum + method.rate,
    0
  );

  // Dynamically determine if there's no encounter based on method rates
  if (Math.random() * 100 > totalMethodRate) {
    return null; // No encounter
  }

  // Filter Pokémon encounters by time, method, and method rate
  const eligibleEncounters = pokemonData.flatMap((pokemon) =>
    pokemon.version_details.flatMap((versionDetail) =>
      versionDetail.encounter_details
        .filter((encounter) => {
          const methodRate = methodRates.find(
            (rate) =>
              rate.version === versionDetail.version.name &&
              (!selectedMethod || rate.method === encounter.method.name)
          );
          const methodMatches = !!methodRate;
          const timeMatches =
            encounter.condition_values.length === 0 ||
            encounter.condition_values.some(
              (condition) => condition.name === currentPokemonTime
            );
          return methodMatches && timeMatches;
        })
        .map((encounter) => ({
          pokemon: pokemon.pokemon,
          version: versionDetail.version,
          encounter,
        }))
    )
  );

  // If no encounters match, return null
  if (eligibleEncounters.length === 0) {
    return null;
  }

  // Combine chances with method rates
  const weightedEncounters = eligibleEncounters.map((encounterData) => {
    const methodRate = methodRates.find(
      (rate) =>
        rate.version === encounterData.version.name &&
        rate.method === encounterData.encounter.method.name
    )?.rate;
    const totalChance =
      (encounterData.encounter.chance || 0) + (methodRate || 0);
    return { ...encounterData, totalChance };
  });

  // Perform weighted random selection
  const totalChance = weightedEncounters.reduce(
    (sum, { totalChance }) => sum + totalChance,
    0
  );
  const randomChance = Math.random() * totalChance;
  let accumulatedChance = 0;

  for (const encounterData of weightedEncounters) {
    accumulatedChance += encounterData.totalChance;
    if (randomChance <= accumulatedChance) {
      const { pokemon, version, encounter } = encounterData;
      const level =
        Math.floor(
          Math.random() * (encounter.max_level - encounter.min_level + 1)
        ) + encounter.min_level;
      const gender = Math.random() < 0.6 ? "Female" : "Male"; // Female = 60%, Male = 40%
      return { pokemon, version, level, gender };
    }
  }

  return null;
};
