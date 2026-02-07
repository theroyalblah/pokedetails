export const capFirstLetter = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

export const removeDashes = (text: string): string => text.replace("-", "");

import pokemonList from "../pokemon.json";

export const normalizePokemonName = (name: string): string => {
  const normalized = name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/\s+/g, "-")
    .replace(/[:.]/g, "-");

  const exactMatch = pokemonList.find(
    (pokemon) => pokemon.toLowerCase() === normalized
  );
  if (exactMatch) {
    return exactMatch;
  }

  const withoutSpecialChars = normalized.replace(/[^a-z0-9-]/g, "");
  const closeMatch = pokemonList.find(
    (pokemon) => pokemon.toLowerCase() === withoutSpecialChars
  );
  if (closeMatch) {
    return closeMatch;
  }

  return normalized;
};
