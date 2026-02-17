import Pokedex, { Pokemon } from "pokedex-promise-v2";
import { Smogon } from "@pkmn/smogon";
import { Generations, Specie } from "@pkmn/data";
import { Dex } from "@pkmn/dex";
import { getFormatsForGeneration } from "./formats";
import { removeDashes } from "./helpers";
import { SmogonStats } from "../components/usageDetails";

export type PokemonData = {
  data?: Pokedex.Pokemon | string;
  smogonStats: SmogonStats[];
  formats: string[];
  vgcStats: SmogonStats;
  species?: Specie;
};

export async function fetchPokemon(
  pokemonNames: string[], 
  generation: number = 9
): Promise<PokemonData[]> {
  const P = new Pokedex();
  const gens = new Generations(Dex);
  const smogon = new Smogon(fetch);

  // Fetch all pokemon data at once
  const pokeDataArray = await P.getPokemonByName(pokemonNames).catch(() => []);
  const pokeDataMap = new Map<string, Pokedex.Pokemon>();
  
  if (Array.isArray(pokeDataArray)) {
    pokeDataArray.forEach((poke) => {
      if (poke && typeof poke !== 'string') {
        pokeDataMap.set(poke.name.toLowerCase(), poke);
      }
    });
  }

  // Process each pokemon
  const results = await Promise.all(
    pokemonNames.map(async (pokemonName) => {
      const pokemon = removeDashes(pokemonName.toLowerCase());
      const species = Dex.data.Species[pokemon];

      const pokedata = pokeDataMap.get(pokemonName.toLowerCase());
      const finalPokemonName = pokedata?.name ?? pokemonName;

      const analyses = await smogon.analyses(gens.get(generation), finalPokemonName).catch(() => null);

      let formats: string[] = [];
      if (!!analyses) {
        analyses.forEach((analysis) => formats.push(analysis.format));
      }

      const acceptedFormats = getFormatsForGeneration(generation);
      const availableFormats = acceptedFormats
        .map((format) => (formats.includes(format) ? format : null))
        .filter((e) => !!e);

      let smogonStats = await Promise.all(
        availableFormats.map((format) =>
          smogon.stats(gens.get(generation), pokemon, format as any).catch(() => null),
        ),
      );

      smogonStats = smogonStats.filter((e) => !!e);

      const vgcStats = await smogon.stats(
        gens.get(generation),
        pokemon,
        `gen${generation}vgc2025` as any,
      ).catch(() => null);

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
    })
  );

  return results;
}
