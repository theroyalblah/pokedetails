/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import Pokedex from "pokedex-promise-v2";
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

type PokeDetailsProps = {
  data: Pokedex.Pokemon | string | undefined;
  smogonStats: SmogonStats;
  vgcStats: SmogonStats;
};

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const PokeDetails = ({ data, smogonStats, vgcStats }: PokeDetailsProps) => {
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

        <Row>
          {!smogonStats?.error ? (
            <>
              <h2>Gen 8 OU</h2>

              <UsageDetails {...smogonStats} />
            </>
          ) : (
            <p>Looks like there&lsquo;s no usage in gen 8 OU :(</p>
          )}
        </Row>

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
  const pokemonName = params?.pokemon ?? "";
  const pokemon = (pokemonName as string).toLowerCase();
  const P = new Pokedex();

  const gens = new Generations(Dex);
  const smogon = new Smogon(fetch);

  let pokedata;
  try {
    pokedata = await P.getPokemonByName(pokemon);
  } catch (e) {}

  const smogonStats = await smogon.stats(gens.get(8), pokemon);

  // smogon's wonky typing is the issue behind this any type, a string is desirable here
  let vgcStats = await smogon.stats(
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
      smogonStats: smogonStats ?? { error: `This pokemon isn't used in gen 8 ou :( ` },
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
