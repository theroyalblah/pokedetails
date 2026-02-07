import Pokedex, { Pokemon } from "pokedex-promise-v2";
import { Smogon } from "@pkmn/smogon";
import { Generations, Specie } from "@pkmn/data";
import { Dex } from "@pkmn/dex";
import acceptedFormats from "./formats";
import { removeDashes } from "./helpers";
import { SmogonStats } from "../components/usageDetails";

export type PokemonData = {
  data?: Pokedex.Pokemon | string;
  smogonStats: SmogonStats[];
  formats: string[];
  vgcStats: SmogonStats;
  species?: Specie;
};

export async function fetchPokemon(pokemonName: string): Promise<PokemonData> {
  const pokemon = removeDashes(pokemonName.toLowerCase());
  const P = new Pokedex();

  const species = Dex.data.Species[pokemon];
  const gens = new Generations(Dex);
  const smogon = new Smogon(fetch);

  let pokedata;
  try {
    pokedata = await P.getPokemonByName(pokemonName);
  } catch (e) {}

  if (!!pokedata) {
    pokemonName = (pokedata as Pokemon)?.name ?? pokemonName;
  }

  const analyses = await smogon.analyses(gens.get(9), pokemonName);
  let formats: string[] = [];
  if (!!analyses) {
    analyses.forEach((analysis) => formats.push(analysis.format));
  }

  const availableFormats = acceptedFormats
    .map((format) => (formats.includes(format) ? format : null))
    .filter((e) => !!e);

  let smogonStats = await Promise.all(
    availableFormats.map((format) =>
      smogon.stats(gens.get(9), pokemon, format as any),
    ),
  );

  smogonStats = smogonStats.filter((e) => !!e);

  const vgcStats = await smogon.stats(
    gens.get(9),
    pokemon,
    "gen9vgc2025" as any,
  );

  return {
    data: pokedata ?? ({
      error: `This pokemon isn't available`,
    } as any),
    formats: availableFormats as string[],
    species: (species ?? null) as any,
    smogonStats: (smogonStats ?? {
      error: `This pokemon doesn't have any sets on smogon :(`,
    }) as any,
    vgcStats: (vgcStats ?? { error: `This pokemon isn't used in vgc :( ` }) as any,
  };
}
