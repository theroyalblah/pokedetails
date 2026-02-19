import { GetServerSideProps } from "next";
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { capFirstLetter, normalizePokemonName } from "../utils/helpers";
import Search from "../components/search";
import Head from "next/head";
import { fetchPokemon, PokemonData } from "../utils/fetchPokemon";
import PokemonCard from "../components/pokemonCard";
import MainPokemonCard from "../components/mainPokemonCard";
import UsageList from "../components/usageList";
import GenerationSelector from "../components/generationSelector";
import PageTitle from "../components/pageTitle";

type TeamGeneratorProps = {
  mainPokemon?: PokemonData;
  teammates: Array<{
    name: string;
    usage: number;
    data?: PokemonData;
  }>;
  otherTeammates?: {
    [key: string]: number;
  };
  format?: string;
  currentGeneration?: number;
  error?: string;
};

const TeamGenerator = ({
  mainPokemon,
  teammates,
  otherTeammates,
  format,
  currentGeneration = 9,
  error,
}: TeamGeneratorProps) => {
  if (error || !mainPokemon) {
    return (
      <>
        <Head>
          <title>Pokedetails - Team Generator</title>
          <meta
            property="og:title"
            content="Pokedetails - Team Generator"
            key="title"
          />
        </Head>

        <main className="poke-details">
          <Container>
            <PageTitle>Team Generator</PageTitle>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
              <Search route="/teamgenerator" />
              <GenerationSelector currentGeneration={currentGeneration} />
            </div>
            {error && <p>{error}</p>}
            {!error && <p>Search for a Pokémon to start generating a team!</p>}
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
          Pokedetails - Team Generator - {capFirstLetter(mainPokemonName)}
        </title>
        <meta
          property="og:title"
          content={`Pokedetails - Team Generator - ${mainPokemonName}`}
          key="title"
        />
      </Head>

      <main className="poke-details">
        <Container>
          <PageTitle>Team Generator</PageTitle>
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
            <Search route="/teamgenerator" />
            <GenerationSelector currentGeneration={currentGeneration} />
          </div>

          <Row className="mb-4">
            <Col sm={12}>
              <MainPokemonCard 
                pokemonData={mainPokemon} 
                name={mainPokemonName}
                moves={mainPokemon.smogonStats[0]?.moves}
                items={mainPokemon.smogonStats[0]?.items}
                abilities={mainPokemon.smogonStats[0]?.abilities}
                spreads={mainPokemon.smogonStats[0]?.spreads}
                currentGeneration={currentGeneration}
              />
            </Col>
          </Row>

          <h2>
            {capFirstLetter(mainPokemonName)}&apos;s Top Teammates
            {format && ` for ${format}`}
          </h2>

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
                    currentGeneration={currentGeneration}
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
  const generation = parseInt((query.gen as string) || "9", 10);

  if (!pokemonName) {
    return {
      props: {
        teammates: [],
        currentGeneration: generation,
      },
    };
  }

  try {
    const results = await fetchPokemon([pokemonName], generation);
    const mainPokemonData = results[0];

    if (
      typeof mainPokemonData.data === "string" ||
      !mainPokemonData.smogonStats.length
    ) {
      return {
        props: {
          error: "Could not find that Pokémon or it has no usage stats",
          teammates: [],
          currentGeneration: generation,
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

    const teammateDataArray = await fetchPokemon(normalizedTeammateNames, generation);

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
        format: mainPokemonData.formats[0] || null,
        currentGeneration: generation,
      },
    };
  } catch (error) {
    return {
      props: {
        error: "An error occurred while fetching Pokémon data",
        teammates: [],
        currentGeneration: generation,
      },
    };
  }
};

export default TeamGenerator;
