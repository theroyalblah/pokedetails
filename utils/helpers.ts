import { ServerResponse } from "http";
import pokemonDisplayNames from "../pokemonDisplayNames.json";

type PokemonDisplayNames = Record<string, Record<string, string>>;

type PokemonSprites = {
  front_default?: string | null;
  other?: {
    [key: string]: {
      front_default?: string | null;
    } | undefined;
  };
};

// 86400 seconds = 24 hours
const CACHE_MAX_AGE = 86400;

export const setCacheHeaders = (res: ServerResponse) => {
  res.setHeader('Cache-Control', `s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate`);
};

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

const problematicPokemonNames = [
  { startsWith: "arceus-", normalized: "arceus" },
  { startsWith: "necrozma-dusk", normalized: "necrozma-dusk" },
  { startsWith: "necrozma-dawn", normalized: "necrozma-dawn" },
];

const formRequiredPokemon: Record<string, string> = {
  "landorus": "landorus-incarnate",
  "thundurus": "thundurus-incarnate",
  "tornadus": "tornadus-incarnate",
  "enamorus": "enamorus-incarnate",
  "dudunsparce": "dudunsparce-two-segment",
  "basculegion": "basculegion-male",
  "indeedee": "indeedee-male",
  "meowstic": "meowstic-male",
  "oinkologne": "oinkologne-male",
};

export const normalizePokemonForSprite = (pokemonName: string): string => {
  const lowerName = pokemonName.toLowerCase();

  if (formRequiredPokemon[lowerName]) {
    return formRequiredPokemon[lowerName];
  }

  const problematic = problematicPokemonNames.find(({ startsWith }) =>
    lowerName.startsWith(startsWith),
  );

  if (problematic) {
    return problematic.normalized;
  }

  return pokemonName;
};

export const formatPokemonDisplayName = (
  pokemonName: string,
  language: string = "en",
): string => {
  if (!pokemonName) return "";

  const lowerName = pokemonName.toLowerCase();
  const displayNamesMap = pokemonDisplayNames as PokemonDisplayNames;

  // Try to find the name in the lookup table
  // For now only names that won't display correctly if capitalized are included in the lookup table
  if (
    displayNamesMap[lowerName] &&
    displayNamesMap[lowerName][language]
  ) {
    return displayNamesMap[lowerName][language];
  }

  if (lowerName.includes("-")) {
    return lowerName.split("-").map(capFirstLetter).join(" ");
  }

  return capFirstLetter(pokemonName);
};

export const getPokemonArtworkUrl = (
  sprites?: PokemonSprites | null,
): string | undefined => {
  return (
    sprites?.other?.["official-artwork"]?.front_default ||
    sprites?.front_default ||
    undefined
  );
};

/**
 * Creates a reverse lookup map from display names to API names
 * e.g., "Mega Charizard X" -> "charizard-mega-x"
 */
const createReverseDisplayNameMap = (): Record<string, string> => {
  const displayNamesMap = pokemonDisplayNames as PokemonDisplayNames;
  const reverseMap: Record<string, string> = {};
  
  for (const [apiName, translations] of Object.entries(displayNamesMap)) {
    if (translations.en) {
      const displayName = translations.en.toLowerCase();
      reverseMap[displayName] = apiName;
    }
  }
  
  return reverseMap;
};

// Cache the reverse lookup map
const reverseDisplayNameMap = createReverseDisplayNameMap();

export const normalizePokemonSearchInput = (input: string): string => {
  if (!input) return "";
  
  const cleaned = input.trim().toLowerCase();
  
  if (reverseDisplayNameMap[cleaned]) {
    return reverseDisplayNameMap[cleaned];
  }
  
  const withDashes = cleaned.replace(/\s+/g, "-");
  
  if (reverseDisplayNameMap[formatPokemonDisplayName(withDashes).toLowerCase()]) {
    return withDashes;
  }
  
  // Try common pattern transformations
  const patterns = [
    // "mega charizard x" -> "charizard-mega-x"
    /^mega\s+(\S+)\s+([xy])$/i,
    // "gigantamax pikachu" -> "pikachu-gmax"
    /^gigantamax\s+(\S+)$/i,
    // "gmax pikachu" -> "pikachu-gmax"
    /^gmax\s+(\S+)$/i,
    // "alolan raichu" -> "raichu-alola"
    /^(alolan|galarian|hisuian|paldean)\s+(\S+)(?:\s+\((.+)\))?$/i,
    // "arceus flying" or "arceus (flying)" -> "arceus-flying"
    /^(\S+)\s+\(([^)]+)\)$/i,
  ];
  
  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match) {
      let candidate = "";
      
      if (pattern.source.startsWith("^mega")) {
        // mega charizard x -> charizard-mega-x
        candidate = match[2] ? `${match[1]}-mega-${match[2]}` : `${match[1]}-mega`;
      } else if (pattern.source.includes("gigantamax")) {
        // gigantamax pikachu -> pikachu-gmax
        candidate = `${match[1]}-gmax`;
      } else if (pattern.source.includes("alolan|galarian")) {
        // alolan raichu -> raichu-alola
        const regionMap: Record<string, string> = {
          alolan: "alola",
          galarian: "galar",
          hisuian: "hisui",
          paldean: "paldea",
        };
        const region = regionMap[match[1]];
        candidate = match[3] ? `${match[2]}-${region}-${match[3].replace(/\s+/g, "-")}` : `${match[2]}-${region}`;
      } else if (pattern.source.includes("\\(")) {
        // arceus (flying) -> arceus-flying
        candidate = `${match[1]}-${match[2].replace(/\s+/g, "-")}`;
      }
      
      // Verify the candidate is in our display names
      if (reverseDisplayNameMap[formatPokemonDisplayName(candidate).toLowerCase()]) {
        return candidate;
      }
    }
  }
  
  return withDashes;
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
