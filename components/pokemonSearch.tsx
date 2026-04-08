import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Search from "./search";
import GenerationSelector from "./generationSelector";

type PokemonSearchProps = {
  currentGeneration?: number;
  route?: string;
};

const PokemonSearch = ({ currentGeneration = 9, route }: PokemonSearchProps) => {
  const router = useRouter();
  const [interactedPokemonName, setInteractedPokemonName] = useState<string>();

  const currentQueryPokemonName = useMemo(() => {
    const queryPokemon = router.query.pokemon;

    if (typeof queryPokemon === "string") {
      return queryPokemon.toLowerCase();
    }

    if (Array.isArray(queryPokemon) && queryPokemon.length > 0) {
      return queryPokemon[0].toLowerCase();
    }

    return undefined;
  }, [router.query.pokemon]);

  useEffect(() => {
    setInteractedPokemonName(undefined);
  }, [currentQueryPokemonName]);

  const generationContextPokemonName = interactedPokemonName ?? currentQueryPokemonName;

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        marginBottom: "16px",
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}
    >
      <Search
        route={route}
        currentGeneration={currentGeneration}
        onSearchPokemonChange={setInteractedPokemonName}
      />

      <GenerationSelector
        currentGeneration={currentGeneration}
        currentPokemonName={generationContextPokemonName}
      />
    </div>
  );
};

export default PokemonSearch;
