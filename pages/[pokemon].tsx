import { GetServerSideProps } from "next";
import Pokedex from "pokedex-promise-v2";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import StatsChart from "../components/chart";
import { capFirstLetter } from "../utils/helpers";
import UsageDetails, { SmogonStats } from "../components/usageDetails";
import Search from "../components/search";
import Image from "next/image";
import { Smogon } from "@pkmn/smogon";
import { Generations } from "@pkmn/data";
import { Dex } from "@pkmn/dex";

type PokeDetailsProps = {
  data: Pokedex.Pokemon | string | undefined;
  smogonStats: SmogonStats;
};

const PokeDetails = ({ data, smogonStats }: PokeDetailsProps) => {
  if (!data || typeof data === "string") {
    return (
      <>
        We didn&lsquo;t find anything with that name
        <Search />
      </>
    );
  }

  const { name, stats } = data;

  return (
    <main className="poke-details">
      <Container>
        <Search />
        <h1>{capFirstLetter(name)}</h1>
        <Row>
          <Col sm={3}>
            <h2>Sprites</h2>
            {data.sprites.front_default ? (
              <Image
                width={120}
                height={120}
                alt="front default"
                src={data.sprites.front_default}
              />
            ) : null}
            {data.sprites.front_shiny ? (
              <Image
                width={120}
                height={120}
                alt="front shiny"
                src={data.sprites.front_shiny ?? ""}
              />
            ) : null}
            {data.sprites.back_default ? (
              <Image
                width={120}
                height={120}
                alt="back default"
                src={data.sprites.back_default ?? ""}
              />
            ) : null}
            {data.sprites.back_shiny ? (
              <Image
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
            <UsageDetails {...smogonStats} />
          ) : (
            <p>Looks like there&lsquo;s no usage in gen 8 OU :(</p>
          )}
        </Row>
        <Search />
      </Container>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const pokemon = (query.pokemon as string).toLowerCase();
  const P = new Pokedex();

  const gens = new Generations(Dex);
  const smogon = new Smogon(fetch);

  const pokedata = await P.getPokemonByName(pokemon);
  const smogonStats = await smogon.stats(gens.get(8), pokemon);

  if (!pokedata) {
    return {
      props: {
        error: "Looks like this pokemon does not exist",
      },
    };
  }

  if (pokedata && !smogonStats) {
    return {
      props: {
        data: pokedata,
        smogonStats: { error: `This pokemon isn't used in gen 8 ou :( ` },
      },
    };
  }
  return {
    props: {
      data: pokedata,
      smogonStats: smogonStats,
    },
  };
};

export default PokeDetails;
