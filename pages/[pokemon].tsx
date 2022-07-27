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
import { Generations } from "@pkmn/data";
import { Dex } from "@pkmn/dex";
import pokemonList from "../utils/allpokemon";
import acceptedFormats from "../utils/formats";

type PokeDetailsProps = {
  data: Pokedex.Pokemon | string | undefined;
  smogonStats: SmogonStats[];
  formats: string[];
  vgcStats: SmogonStats;
};

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const PokeDetails = ({
  data,
  smogonStats,
  vgcStats,
  formats,
}: PokeDetailsProps) => {
  if (!data || typeof data === "string") {
    return (
      <>
        We didn&lsquo;t find anything with that name
        <Search />
      </>
    );
  }

  const { name, stats, types } = data;

  return (
    <main className="poke-details">
      <Container>
        <Search />
        <h1>{capFirstLetter(name)}</h1>

        {types.map((type) => {
          return (
            <span key={type.type.name} className="types">
              <span className={`types__${type.type.name}`}>
                {capitalize(type.type.name)}
              </span>
            </span>
          );
        })}

        <Row>
          <Col sm={3}>
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
          </Col>

          <Col sm={9}>
            <StatsChart stats={stats} />
          </Col>
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

  const smogonStats = await Promise.all(
    availableFormats.map((format) =>
      smogon.stats(gens.get(8), pokemon, format as any)
    )
  );

  // smogon's wonky typing is the issue behind this any type, a string is desirable here
  const vgcStats = await smogon.stats(
    gens.get(8),
    pokemon,
    "gen8vgc2022" as any
  );

  if (!pokedata) {
    return {
      props: {
        error: "Looks like this pokemon does not exist",
      },
    };
  }

  return {
    props: {
      data: pokedata,
      formats: availableFormats,
      smogonStats: smogonStats ?? {
        error: `This pokemon isn't used in gen 8 ou :( `,
      },
      vgcStats: vgcStats ?? { error: `This pokemon isn't used in vgc :( ` },
    },
  };
};

export async function getStaticPaths() {
  const pokemonPaths = pokemonList.map((poke) => {
    return `/${poke.toLowerCase().replace(" ", "")}`;
  });

  return {
    paths: pokemonPaths,
    fallback: false,
  };
}

export default PokeDetails;
