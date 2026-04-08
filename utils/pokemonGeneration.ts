import pokemonReleaseGenerations from "./pokemonReleaseGenerations.json";

type PokemonReleaseGenerations = Record<string, number>;

const releaseGenerationMap =
  pokemonReleaseGenerations as PokemonReleaseGenerations;

export const LATEST_GENERATION = 9;

export const AVAILABLE_GENERATIONS = [9, 8, 7, 6, 5, 4, 3, 2, 1] as const;

export const getPokemonReleaseGeneration = (
  pokemonName?: string | null,
): number | null => {
  if (!pokemonName) {
    return null;
  }

  const releaseGeneration = releaseGenerationMap[pokemonName.toLowerCase()];

  if (!releaseGeneration) {
    return null;
  }

  return releaseGeneration;
};

export const getAvailableGenerationsForPokemon = (
  pokemonName?: string | null,
): number[] => {
  const releaseGeneration = getPokemonReleaseGeneration(pokemonName);

  if (!releaseGeneration) {
    return [...AVAILABLE_GENERATIONS];
  }

  return AVAILABLE_GENERATIONS.filter(
    (generation) => generation >= releaseGeneration,
  );
};

export const getResolvedGenerationForPokemon = (
  pokemonName: string | null | undefined,
  requestedGeneration?: number,
): number => {
  if (!requestedGeneration || !AVAILABLE_GENERATIONS.includes(requestedGeneration as (typeof AVAILABLE_GENERATIONS)[number])) {
    return LATEST_GENERATION;
  }

  const releaseGeneration = getPokemonReleaseGeneration(pokemonName);

  if (releaseGeneration && requestedGeneration < releaseGeneration) {
    return LATEST_GENERATION;
  }

  return requestedGeneration;
};