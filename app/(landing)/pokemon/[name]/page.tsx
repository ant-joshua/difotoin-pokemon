"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import AbilityDetail from "@/components/AbilityDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pokemon } from "@/lib/types/pokemon";

export default function PokemonDetail() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((response) => response.json())
      .then((data) => setPokemon(data));
  }, [name]);

  if (!pokemon) return <div>Loading...</div>;

  return (
    <main>
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl font-bold">{pokemon.name}</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Image
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt={pokemon.name}
              width={200}
              height={200}
            />
            <div>
              <h2 className="text-xl font-semibold">Abilities:</h2>
              {pokemon.abilities.map(({ ability }) => (
                <Button
                  key={ability.name}
                  onClick={() => setSelectedAbility(ability.name)}
                  variant="outline"
                  className="mr-2 mb-2"
                >
                  {ability.name}
                </Button>
              ))}
            </div>
            {selectedAbility && (
              <AbilityDetail
                abilityName={selectedAbility}
                onClose={() => setSelectedAbility(null)}
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">Forms:</h2>
              <ul>
                {pokemon.forms.map((form) => (
                  <li key={form.name}>{form.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Stats:</h2>
              <ul>
                {pokemon.stats.map(({ base_stat, stat }) => (
                  <li key={stat.name}>
                    {stat.name}: {base_stat}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Types:</h2>
              <ul>
                {pokemon.types.map(({ type }) => (
                  <li key={type.name}>{type.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
