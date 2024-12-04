"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pokemon } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  useEffect(() => {
    getPokemonList();
  }, []);

  const filteredPokemon = pokemons.filter((p) =>
    p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  async function getPokemonList() {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=100&offset=0`
    );
    const data = await response.json();
    const result = data.results;

    result.forEach(async (pokemon: Pokemon) => {
      const responseDetail = await fetch(pokemon.url);
      const dataDetail = await responseDetail.json();

      setPokemons((prev) => [
        ...prev,
        {
          name: pokemon.name,
          url: pokemon.url,
          detail: dataDetail,
        },
      ]);
    });
  }

  return (
    <>
      <main>
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Pokemon List</CardTitle>
            </CardHeader>
            <CardContent>
              <section className="space-y-4 mb-5">
                <Input
                  type="text"
                  placeholder="Search pokemon..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </section>
              <section className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPokemon.map((pokemon, index) => (
                  <Link key={index} href={`pokemon/${pokemon.name}`}>
                    <Card>
                      {pokemon.detail && (
                        <div className="aspect-w-4 aspect-h-5 relative">
                          <div className="flex justify-center">
                            <Image
                              src={
                                pokemon.detail.sprites.other["official-artwork"]
                                  .front_default
                              }
                              alt="Product"
                              width={400}
                              height={500}
                              className="object-cover rounded-t-lg"
                              style={{
                                aspectRatio: "400/500",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle>{pokemon.name}</CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </section>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
