"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCollectionList } from "@/lib/store/collection";
import { Pokemon } from "@/lib/types/pokemon";
import Image from "next/image";

import { useState } from "react";

export default function CollectionPage() {
  const [collection] = useState<Pokemon[]>(getCollectionList());

  return (
    <main>
      <Card>
        <CardHeader>
          <CardTitle>My Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <section className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {collection.map((pokemon, index) => (
              <Card key={index}>
                <div className="aspect-w-4 aspect-h-5 relative">
                  <div className="flex justify-center">
                    <Image
                      src={
                        pokemon.sprites.other["official-artwork"].front_default
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

                <CardHeader>
                  <CardTitle>{pokemon.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p>Code : {pokemon.code}</p>
                  <p>Level : {pokemon.level}</p>
                  <p>Type : </p>
                  <div className="flex gap-2">
                    {pokemon.types.map((type) => (
                      <Badge key={type.type.name}>{type.type.name}</Badge>
                    ))}
                  </div>
                  <p>Abilities : </p>
                  <div className="flex gap-2">
                    {pokemon.abilities.map((ability) => (
                      <Badge key={ability.ability.name}>
                        {ability.ability.name}
                      </Badge>
                    ))}
                  </div>
                  <p>
                    Version :{" "}
                    {pokemon.version ? pokemon.version.name : "Unknown"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
