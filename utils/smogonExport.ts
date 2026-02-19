import { PokemonData } from "./fetchPokemon";
import { capFirstLetter } from "./helpers";
import { STAT_LABELS_SHORT } from "./constants";

/**
 * Converts a Pokemon's data to Smogon team format
 */
export function formatPokemonForSmogon(
  pokemonName: string,
  pokemonData: PokemonData,
): string {
  const stats = pokemonData.smogonStats?.[0];
  if (!stats) return "";

  const lines: string[] = [];

  // Pokemon name @ item
  const item = stats.items ? Object.keys(stats.items)[0] : null;
  if (item) {
    lines.push(`${capFirstLetter(pokemonName)} @ ${formatItemName(item)}`);
  } else {
    lines.push(capFirstLetter(pokemonName));
  }

  const ability = stats.abilities ? Object.keys(stats.abilities)[0] : null;
  if (ability) {
    lines.push(`Ability: ${formatAbilityName(ability)}`);
  }

  // EVs
  // ex: EVs: 252 Atk / 4 SpD / 252 Spe
  const spread = stats.spreads ? Object.keys(stats.spreads)[0] : null;
  if (spread) {
    const evs = parseSpreadToEVs(spread);
    if (evs) {
      lines.push(`EVs: ${evs}`);
    }
  }

  // [nature] Nature
  if (spread) {
    const nature = spread.split(":")[0];
    if (nature) {
      lines.push(`${capFirstLetter(nature)} Nature`);
    }
  }

  /* Moves list with a dash and a newline at the end
    - Swords Dance
    - Bullet Punch
    - Knock Off
    - Roost
  */
  const moves = stats.moves ? Object.keys(stats.moves).slice(0, 4) : [];
  moves.forEach((move) => {
    lines.push(`- ${formatMoveName(move)}`);
  });

  return lines.join("\n");
}

/**
 * Exports a full team (main Pokemon + teammates) to Smogon format
 */
export function exportTeamToSmogon(
  mainPokemon: { name: string; data: PokemonData },
  teammates: Array<{ name: string; data?: PokemonData }>,
): string {
  const pokemonList = [mainPokemon, ...teammates.filter((t) => t.data)];

  return pokemonList
    .map((pokemon) => {
      if (!pokemon.data) return "";
      return formatPokemonForSmogon(pokemon.name, pokemon.data);
    })
    .filter((text) => text)
    .join("\n\n");
}

function formatItemName(item: string): string {
  return item
    .split("-")
    .map((word) => capFirstLetter(word))
    .join(" ");
}

function formatAbilityName(ability: string): string {
  return ability
    .split("-")
    .map((word) => capFirstLetter(word))
    .join(" ");
}

function formatMoveName(move: string): string {
  return move
    .split("-")
    .map((word) => capFirstLetter(word))
    .join(" ");
}

function parseSpreadToEVs(spread: string): string | null {
  // Spread format: "Nature:HP/Atk/Def/SpA/SpD/Spe"
  const parts = spread.split(":");
  if (parts.length < 2) return null;

  const evs = parts[1].split("/");
  if (evs.length !== 6) return null;

  const nonZeroEVs: string[] = [];

  evs.forEach((ev, index) => {
    const evValue = parseInt(ev, 10);
    if (evValue > 0) {
      nonZeroEVs.push(`${evValue} ${STAT_LABELS_SHORT[index]}`);
    }
  });

  return nonZeroEVs.length > 0 ? nonZeroEVs.join(" / ") : null;
}
