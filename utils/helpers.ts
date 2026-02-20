export const capFirstLetter = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

export const removeDashes = (text: string): string => text.replace("-", "");

export const createGoodLink = (name: string, baseUrl = ""): string => {
  let poke = name.toLowerCase();
  poke = poke.replace(/[^\w\s-]/gi, "");
  return baseUrl + poke.replace(" ", "-");
};

export const createLinkWithGeneration = (
  name: string,
  baseUrl = "",
  currentGeneration?: number,
): string => {
  const link = createGoodLink(name, baseUrl);
  // Only add generation param for internal links (empty baseUrl)
  if (baseUrl === "" && currentGeneration) {
    return `${link}?gen=${currentGeneration}`;
  }
  return link;
};

export const getSmogonGenAbbreviation = (generation: number = 9): string => {
  const genMap: { [key: number]: string } = {
    1: "rb",
    2: "gs",
    3: "rs",
    4: "dp",
    5: "bw",
    6: "xy",
    7: "sm",
    8: "ss",
    9: "sv",
  };
  return genMap[generation] || "sv";
};

export const getSmogonUrl = (
  type: "abilities" | "moves" | "items" | "pokemon",
  generation: number = 9,
): string => {
  const genAbbrev = getSmogonGenAbbreviation(generation);
  return `https://www.smogon.com/dex/${genAbbrev}/${type}/`;
};

export const shouldExcludeValue = (item: string): boolean => {
  const lowerItem = item.toLowerCase();
  return lowerItem === "nothing" || lowerItem === "no ability";
};

import pokemonList from "../pokemon.json";

export const normalizePokemonName = (name: string): string => {
  const normalized = name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/\s+/g, "-")
    .replace(/[:.]/g, "-");

  const exactMatch = pokemonList.find(
    (pokemon) => pokemon.toLowerCase() === normalized,
  );
  if (exactMatch) {
    return exactMatch;
  }

  const withoutSpecialChars = normalized.replace(/[^a-z0-9-]/g, "");
  const closeMatch = pokemonList.find(
    (pokemon) => pokemon.toLowerCase() === withoutSpecialChars,
  );
  if (closeMatch) {
    return closeMatch;
  }

  return normalized;
};

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
