"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

import { Pokemon } from "@/lib/types/pokemon";
import AutoComplete from "@/components/AutoComplete";
import { Badge } from "@/components/ui/badge";
import { applyGachaFormula } from "@/lib/gacha/gacha";
import {
  EncounterMethodRate,
  Location,
  PokemonEncounter,
} from "@/lib/types/location";
import { addCollectionList } from "@/lib/store/collection";
import { nanoid } from "nanoid";
import { toast } from "sonner";

export default function GachaPage() {
  const [locations, setLocations] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");
  const [caughtPokemon, setCaughtPokemon] = useState<Pokemon | null>(null);
  const [encounterRates, setEncounterRates] = useState<EncounterMethodRate[]>(
    []
  );
  const [selectedEncounterMethod, setSelectedEncounterMethod] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetch(`https://pokeapi.co/api/v2/location/${selectedLocation}`)
        .then((response) => response.json())
        .then((data) => {
          // Get the first area of the location
          return fetch(data.areas[0].url);
        })
        .then((response) => response.json())
        .then((data) => {
          setEncounterRates(data.encounter_method_rates);
        });
    }
  }, [selectedLocation]);

  const fetchLocations = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/location?limit=100"
      );
      const data = await response.json();
      setLocations(
        data.results.map((location: Location) => ({
          value: location.name,
          label: location.name,
        }))
      );
    } catch (e) {
      console.error("Error fetching locations:", e);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const performGacha = async () => {
    if (!selectedLocation) {
      alert("Please select a location.");
      return;
    }

    if (!selectedEncounterMethod) {
      alert("Please select an encounter method.");
      return;
    }

    const response = await fetch(
      `https://pokeapi.co/api/v2/location/${selectedLocation}`
    );
    const locationData = await response.json();

    // Get a random area from the location
    const areaUrl =
      locationData.areas[Math.floor(Math.random() * locationData.areas.length)]
        .url;
    const areaResponse = await fetch(areaUrl);
    const areaData = await areaResponse.json();

    // Get all Pokemon encounters from the area
    const encounters = areaData.pokemon_encounters as PokemonEncounter[];
    // Get all Pokemon encounters method rates from the area
    const encounterMethodRates =
      areaData.encounter_method_rates as EncounterMethodRate[];

    // Apply gacha formula
    const caughtPokemon = applyGachaFormula(
      encounters,
      encounterMethodRates,
      selectedEncounterMethod
    );

    if (caughtPokemon) {
      const pokemonResponse = await fetch(caughtPokemon.pokemon.url);
      const pokemonData = await pokemonResponse.json();
      const code = nanoid();

      setCaughtPokemon({
        ...pokemonData,
        code: code,
        gender: caughtPokemon.gender,
        level: caughtPokemon.level,
        version: caughtPokemon.version,
      });
    } else {
      setCaughtPokemon(null);
    }
  };

  const addPokemonToMyCollection = () => {
    const isAdded = addCollectionList(caughtPokemon!);

    if (isAdded) {
      toast.info(`${caughtPokemon?.name} has been added to your collection!`);
    } else {
      toast.error(`${caughtPokemon?.name} is already in your collection!`);
    }
  };

  return (
    <div className="space-y-4 p-5">
      <Card>
        <CardHeader>
          <CardTitle>Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <AutoComplete<string>
            selectedValue={selectedLocation}
            onSelectedValueChange={setSelectedLocation}
            searchValue={searchValue}
            onSearchValueChange={setSearchValue}
            items={locations}
            isLoading={isLoading}
            emptyMessage="No locations found."
            placeholder="Search for a location..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Encounter Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {encounterRates.map((rate, index) => (
              <Badge
                key={index}
                variant={
                  selectedEncounterMethod === rate.encounter_method.name
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setSelectedEncounterMethod(rate.encounter_method.name)
                }
              >
                {rate.encounter_method.name}: {rate.version_details[0].rate}%
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Button
            onClick={performGacha}
            disabled={!selectedLocation || isLoading}
            className="w-full mt-4"
          >
            Perform Gacha
          </Button>
        </CardContent>
      </Card>

      {caughtPokemon && (
        <Card>
          <CardHeader>
            <CardTitle>You caught a {caughtPokemon.name}!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <Image
                src={
                  caughtPokemon.sprites.other["official-artwork"].front_default
                }
                alt={caughtPokemon.name}
                width={200}
                height={200}
              />
              <p>Code : {caughtPokemon.code}</p>
              <p>Gender: {caughtPokemon.gender}</p>
              <p>Level: {caughtPokemon.level}</p>
              <p>Version: {caughtPokemon.version?.name}</p>
              <p>Type: </p>
              <div className="flex gap-2">
                {caughtPokemon.types.map((type) => (
                  <Badge key={type.type.name}>{type.type.name}</Badge>
                ))}
              </div>
              <p>Abilities: </p>
              <div className="flex gap-2">
                {caughtPokemon.abilities.map((ability) => (
                  <Badge key={ability.ability.name}>
                    {ability.ability.name}
                  </Badge>
                ))}
              </div>
              {/* Add to Collection */}
              <Button
                className="mt-4"
                onClick={() => addPokemonToMyCollection()}
              >
                Add to Collection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {caughtPokemon === null && (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center justify-center pt-5">
              <p>No Pokemon encountered this time. Try again!</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
