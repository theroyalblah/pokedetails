import { GetServerSideProps } from "next";
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { capFirstLetter, normalizePokemonName } from "../utils/helpers";
import Search from "../components/search";
import Head from "next/head";
import { fetchPokemon, PokemonData } from "../utils/fetchPokemon";
import PokemonCard from "../components/pokemonCard";
import UsageList from "../components/usageList";

type TeamBuilderProps = {
  mainPokemon?: PokemonData;
  teammates: Array<{
    name: string;
    usage: number;
    data?: PokemonData;
  }>;
  otherTeammates?: {
    [key: string]: number;
  };
  error?: string;
};

const TeamBuilder = ({
  mainPokemon,
  teammates,
  otherTeammates,
  error,
}: TeamBuilderProps) => {
  if (error || !mainPokemon) {
    return (
      <>
        <Head>
          <title>Pokedetails - Team Builder</title>
          <meta
            property="og:title"
            content="Pokedetails - Team Builder"
            key="title"
          />
        </Head>

        <main className="poke-details">
          <Container>
            <h1>Team Builder</h1>
            <Search route="/teambuilder" />
            {error && <p>{error}</p>}
            {!error && <p>Search for a Pokémon to start building a team!</p>}
          </Container>
        </main>
      </>
    );
  }

  const mainPokemonName =
    typeof mainPokemon.data === "string"
      ? ""
      : (mainPokemon.data?.name ?? mainPokemon.species?.name ?? "");

  return (
    <>
      <Head>
        <title>
          Pokedetails - Team Builder - {capFirstLetter(mainPokemonName)}
        </title>
        <meta
          property="og:title"
          content={`Pokedetails - Team Builder - ${mainPokemonName}`}
          key="title"
        />
      </Head>

      <main className="poke-details">
        <Container>
          <h1>Team Builder</h1>
          <Search route="/teambuilder?pokemon" />

          <Row className="mb-4">
            <Col sm={12}>
              <PokemonCard pokemonData={mainPokemon} name={mainPokemonName} />
            </Col>
          </Row>

          <h2>{capFirstLetter(mainPokemonName)}&apos;s Top Teammates</h2>

          <Row>
            {teammates.map((teammate) => {
              if (!teammate.data) return null;

              const firstFormatStats = teammate.data.smogonStats?.[0];

              return (
                <Col key={teammate.name} sm={12} md={6} lg={4} className="mb-4">
                  <PokemonCard
                    pokemonData={teammate.data}
                    name={teammate.name}
                    usage={teammate.usage}
                    isSmall={true}
                    moves={firstFormatStats?.moves}
                    items={firstFormatStats?.items}
                    abilities={firstFormatStats?.abilities}
                    spreads={firstFormatStats?.spreads}
                  />
                </Col>
              );
            })}

            {otherTeammates && Object.keys(otherTeammates).length > 0 && (
              <Col sm={12} md={6} lg={4} className="mb-4">
                <Card
                  style={{
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #444",
                    height: "100%",
                  }}
                >
                  <Card.Body>
                    <UsageList
                      title="Other Teammates"
                      data={otherTeammates}
                      count={10}
                      baseUrl=""
                    />
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </Container>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const pokemonName = query.pokemon as string;
  console.log("Fetching data for:", pokemonName);

  if (!pokemonName) {
    return {
      props: {
        teammates: [],
      },
    };
  }

  try {
    const results = await fetchPokemon([pokemonName]);
    const mainPokemonData = results[0];

    if (
      typeof mainPokemonData.data === "string" ||
      !mainPokemonData.smogonStats.length
    ) {
      return {
        props: {
          error: "Could not find that Pokémon or it has no usage stats",
          teammates: [],
        },
      };
    }

    const firstFormatStats = mainPokemonData.smogonStats[0];
    const teammates = firstFormatStats?.teammates || {};

    const sortedTeammateNames = Object.keys(teammates).sort(
      (a, b) => teammates[b] - teammates[a],
    );

    const topTeammateNames = sortedTeammateNames.slice(0, 5);
    const otherTeammateNames = sortedTeammateNames.slice(5, 20);

    const otherTeammates: { [key: string]: number } = {};
    otherTeammateNames.forEach((name) => {
      otherTeammates[name] = teammates[name];
    });

    // Normalize all teammate names and fetch them all at once
    const normalizedTeammateNames = topTeammateNames.map((name) =>
      normalizePokemonName(name),
    );

    const teammateDataArray = await fetchPokemon(normalizedTeammateNames);

    const teammatesWithData = topTeammateNames.map((name, index) => ({
      name,
      usage: teammates[name],
      data: teammateDataArray[index],
    }));

    return {
      props: {
        mainPokemon: mainPokemonData,
        teammates: teammatesWithData,
        otherTeammates,
      },
    };
  } catch (error) {
    return {
      props: {
        error: "An error occurred while fetching Pokémon data",
        teammates: [],
      },
    };
  }
};

export default TeamBuilder;
