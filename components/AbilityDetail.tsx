"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface AbilityDetailProps {
  abilityName: string;
  onClose: () => void;
}

interface AbilityEffect {
  effect: string;
  language: {
    name: string;
  };
}

export default function AbilityDetail({
  abilityName,
  onClose,
}: AbilityDetailProps) {
  const [effect, setEffect] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`)
      .then((response) => response.json())
      .then((data) => {
        const englishEffect = data.effect_entries.find(
          (entry: AbilityEffect) => entry.language.name === "en"
        );
        setEffect(
          englishEffect
            ? englishEffect.effect
            : "No effect description available."
        );
      });
  }, [abilityName]);

  return (
    <div className="mt-4 p-4 border rounded-md">
      <h3 className="text-lg font-semibold">{abilityName}</h3>
      <p>{effect || "Loading..."}</p>
      <Button onClick={onClose} className="mt-2">
        Close
      </Button>
    </div>
  );
}
