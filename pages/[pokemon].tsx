import { GetServerSideProps } from "next";
import Pokedex from "pokedex-promise-v2";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import StatsChart from "../components/chart";
import { capFirstLetter } from "../utils/helpers";
import * as https from "https";
import UsageDetails, { UsageDetailsType } from "../components/usageDetails";
import Search from "../components/search";

type PokeDetailsProps = {
  data: Pokedex.Pokemon | string | undefined;
  ouUsage: UsageDetailsType;
};

const PokeDetails = ({ data, ouUsage }: PokeDetailsProps) => {
  if (!data || typeof data === "string") {
    return (
      <>
        We didn't find anything with that name
        <Search />
      </>
    );
  }

  const { name, stats } = data;
  console.log(ouUsage);
  return (
    <main className="poke-details">
      <Container>
        <Search />
        <h1>{capFirstLetter(name)}</h1>
        <Row>
          <Col sm={3}>
            <h2>Sprites</h2>
            <img src={data.sprites.front_default ?? ""} />
            <img src={data.sprites.front_shiny ?? ""} />
            <img src={data.sprites.back_default ?? ""} />
            <img src={data.sprites.back_shiny ?? ""} />
          </Col>
          <Col sm={9}>
            <StatsChart stats={stats} />
          </Col>
        </Row>
        <Row>
          {!ouUsage?.error ? (
            <UsageDetails {...ouUsage} />
          ) : (
            <p>Looks like there's no usage in gen 8 OU :(</p>
          )}
        </Row>
      </Container>
      <Container>{JSON.stringify(data, null, 2)}</Container>
    </main>
  );
};

const getUsageStats = async (pokemon: string) => {
  const url = `https://smogon-usage-stats.herokuapp.com/gen8ou/${pokemon}`;

  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const obj = JSON.parse(data);

        resolve(obj);
      });
    });
  });
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const pokemon = query.pokemon;
  const P = new Pokedex();

  try {
    const pokedata = await P.getPokemonByName(pokemon as string);
    const ouUsage = await getUsageStats(pokemon as string);

    return {
      props: {
        data: pokedata,
        ouUsage: ouUsage,
      },
    };
  } catch (error) {
    return {
      props: {
        error: "pokemon not found",
      },
    };
  }
};

export default PokeDetails;
