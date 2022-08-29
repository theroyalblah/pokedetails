/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import Pokedex, { Pokemon } from "pokedex-promise-v2";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import StatsChart from "../components/chart";
import { capFirstLetter } from "../utils/helpers";
import UsageDetails, { SmogonStats } from "../components/usageDetails";
import Search from "../components/search";
import { Smogon } from "@pkmn/smogon";
import { Generations, Specie } from "@pkmn/data";
import { Dex } from "@pkmn/dex";
import pokemonList from "../pokemon.json";
import acceptedFormats from "../utils/formats";

type PokeDetailsProps = {
  data?: Pokedex.Pokemon | string;
  smogonStats: SmogonStats[];
  formats: string[];
  vgcStats: SmogonStats;
  species?: Specie;
};

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const PokeDetails = ({
  data,
  smogonStats,
  vgcStats,
  formats,
  species,
}: PokeDetailsProps) => {
  if (!data || typeof data === "string") {
    return (
      <>
        We didn&lsquo;t find anything with that name
        <Search />
      </>
    );
  }

  const pokemonTypes = species?.types ?? [];

  return (
    <main className="poke-details">
      <Container>
        <Search />
        <h1>{capFirstLetter(data.name ?? species?.name)}</h1>

        {pokemonTypes.map((type) => {
          const t = type.toLowerCase();

          return (
            <span key={t} className="types">
              <span className={`types__${t}`}>
                {capitalize(t)}
              </span>
            </span>
          );
        })}

        <Row>
          <Col sm={3}>
            {data.sprites && (
              <>
                <h2>Sprites</h2>
                {data.sprites.front_default ? (
                  <img
                    width={120}
                    height={120}
                    alt="front default"
                    src={data.sprites.front_default}
                  />
                ) : null}
                {data.sprites.front_shiny ? (
                  <img
                    width={120}
                    height={120}
                    alt="front shiny"
                    src={data.sprites.front_shiny ?? ""}
                  />
                ) : null}
                {data.sprites.back_default ? (
                  <img
                    width={120}
                    height={120}
                    alt="back default"
                    src={data.sprites.back_default ?? ""}
                  />
                ) : null}
                {data.sprites.back_shiny ? (
                  <img
                    width={120}
                    height={120}
                    alt="back shiny"
                    src={data.sprites.back_shiny ?? ""}
                  />
                ) : null}
              </>
            )}
          </Col>

          <Col sm={9}>{species?.baseStats && <StatsChart stats={species?.baseStats} bst={((species as unknown) as {bst: number})?.bst} />}</Col>
        </Row>

        {!!smogonStats &&
          smogonStats.map((format, i) => {
            return (
              <div key={formats[i]}>
                <h2>{formats[i]}</h2>

                <UsageDetails {...format} />
              </div>
            );
          })}

        {vgcStats && (
          <>
            <h2>VGC 2022 Stats</h2>

            <Row>
              {!vgcStats?.error ? (
                <UsageDetails {...vgcStats} />
              ) : (
                <p>Looks like there&lsquo;s no usage in vgc :(</p>
              )}
            </Row>
          </>
        )}

        <Search />
      </Container>
    </main>
  );
};

export const getStaticProps: GetServerSideProps = async ({ params }) => {
  let pokemonName = (params?.pokemon as string) ?? "";
  const pokemon = (pokemonName as string).toLowerCase();
  const P = new Pokedex();

  const gens = new Generations(Dex);
  const smogon = new Smogon(fetch);

  const gen8 = gens.get(8);
  const species = gen8.species.get(pokemon)?.toJSON() ?? {};

  Object.keys(species).forEach((key) => {
    if (species[key] === undefined) {
      delete species[key];
    }
  });

  let pokedata;
  try {
    pokedata = await P.getPokemonByName(pokemon);
  } catch (e) {}

  if (!!pokedata) {
    pokemonName = (pokedata as Pokemon)?.name ?? pokemonName;
  }

  const analyses = await smogon.analyses(gens.get(8), pokemonName);
  let formats: string[] = [];
  if (!!analyses) {
    analyses.forEach((analysis) => formats.push(analysis.format));
  }

  const availableFormats = acceptedFormats
    .map((format) => (formats.includes(format) ? format : null))
    .filter((e) => !!e);

  let smogonStats = await Promise.all(
    availableFormats.map((format) =>
      smogon.stats(gens.get(8), pokemon, format as any)
    )
  );

  smogonStats = smogonStats.filter((e) => !!e);

  // smogon's wonky typing is the issue behind this any type, a string is desirable here
  const vgcStats = await smogon.stats(
    gens.get(8),
    pokemon,
    "gen8vgc2022" as any
  );

  return {
    props: {
      data: pokedata ?? {
        error: `This pokemon isn't available`,
      },
      formats: availableFormats,
      species: species,
      smogonStats: smogonStats ?? {
        error: `This pokemon isn't used in gen 8 ou :( `,
      },
      vgcStats: vgcStats ?? { error: `This pokemon isn't used in vgc :( ` },
    },
  };
};

export async function getStaticPaths() {
  const pokemonPaths = pokemonList.map((poke) => {
    return `/${poke}`;
  });

  return {
    paths: pokemonPaths,
    fallback: false,
  };
}

export default PokeDetails;
