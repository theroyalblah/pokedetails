import { Generations } from "@pkmn/data";
import { Dex } from "@pkmn/dex";
import fs from "fs";

const gens = new Generations(Dex);

const gen8 = gens.get(8);

const species = gen8.dex.data.Species;

const pokemonNames = Object.entries(species).map((pkmn) => {
  let name = pkmn[1].name;
  name = name.replace(" ", "-");
  name = name.replace(/[&\/\\#,’+()$~%.'":*?<>{}]/g, "");
  return name.toLowerCase();
});

const data = JSON.stringify(pokemonNames);
fs.writeFileSync("pokemon.json", data);
