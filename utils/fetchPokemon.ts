import Pokedex, { Pokemon } from "pokedex-promise-v2";
import { Smogon } from "@pkmn/smogon";
import { Generations, Specie } from "@pkmn/data";
import { Dex } from "@pkmn/dex";
import { getFormatsForGeneration } from "./formats";
import { removeDashes } from "./helpers";
import { SmogonStats } from "../components/usageDetails";

// Singleton instances to benefit from caching and avoid recreating objects
const pokedex = new Pokedex();
const generations = new Generations(Dex);
const smogon = new Smogon(fetch);

export type PokemonData = {
  data?: Pokedex.Pokemon | string;
  smogonStats: SmogonStats[];
  formats: string[];
  vgcStats?: SmogonStats;
  vgcFormat?: string | null;
  species?: Specie;
};

export async function fetchPokemon(
  pokemonNames: string[], 
  generation: number = 9,
  includeVGC: boolean = false
): Promise<PokemonData[]> {

  // Fetch all pokemon data at once
  const pokeDataArray = await pokedex.getPokemonByName(pokemonNames).catch(() => []);
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

      const analyses = await smogon.analyses(generations.get(generation), finalPokemonName).catch(() => null);

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
          smogon.stats(generations.get(generation), pokemon, format as any).catch(() => null),
        ),
      );

      smogonStats = smogonStats.filter((e) => !!e);

      // VGC
      const vgcFormats = includeVGC ? formats.filter(format => format.includes('vgc')) : [];
      const vgcStats = includeVGC && vgcFormats.length > 0
        ? await smogon.stats(
            generations.get(generation),
            pokemon,
            // Fetch stats for the first VGC format found (usually the most recent)
            vgcFormats[0] as any,
          ).catch(() => null)
        : null;

      return {
        data: pokedata ?? ({
          error: `This pokemon isn't available`,
        } as any),
        formats: availableFormats as string[],
        species: (species ?? null) as any,
        smogonStats: (smogonStats ?? {
          error: `This pokemon doesn't have any sets on smogon :(`,
        }) as any,
        ...(includeVGC && {
          vgcStats: (vgcStats ?? { error: `This pokemon isn't used in vgc :( ` }) as any,
          vgcFormat: vgcFormats[0] ?? null,
        }),
      };
    })
  );

  return results;
}
