import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { capFirstLetter, normalizePokemonName, copyToClipboard } from "../utils/helpers";
import Search from "../components/search";
import Head from "next/head";
import { fetchPokemon, PokemonData } from "../utils/fetchPokemon";
import PokemonCard from "../components/pokemonCard";
import MainPokemonCard from "../components/mainPokemonCard";
import UsageList from "../components/usageList";
import GenerationSelector from "../components/generationSelector";
import FormatSelector from "../components/formatSelector";
import PageTitle from "../components/pageTitle";
import { exportTeamToSmogon } from "../utils/smogonExport";

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
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportTeam = async () => {
    if (!mainPokemon) return;

    setIsExporting(true);

    const mainPokemonName =
      typeof mainPokemon.data === "string"
        ? ""
        : (mainPokemon.data?.name ?? mainPokemon.species?.name ?? "");

    const teamText = exportTeamToSmogon(
      { name: mainPokemonName, data: mainPokemon },
      teammates
    );

    try {
      await copyToClipboard(teamText);
      setShowCopyAlert(true);
      setTimeout(() => {
        setShowCopyAlert(false);
        setIsExporting(false);
      }, 3000);
    } catch (err) {
      setIsExporting(false);
    }
  };

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
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <Search route="/teamgenerator" />
            <GenerationSelector currentGeneration={currentGeneration} />
            <Button
              onClick={handleExportTeam}
              disabled={isExporting || showCopyAlert}
              style={{
                backgroundColor: showCopyAlert ? "#28a745" : "#6b9bd1",
                borderColor: showCopyAlert ? "#28a745" : "#6b9bd1",
                color: "#fff",
                transition: "all 0.3s ease",
              }}
            >
              {showCopyAlert ? "✓ Copied!" : "Export Team"}
            </Button>
          </div>

          <Row className="mb-4">
            <Col sm={12}>
              <MainPokemonCard 
                pokemonData={mainPokemon} 
                name={mainPokemonName}
                moves={mainPokemon.smogonStats[mainPokemon.formats.indexOf(format || mainPokemon.formats[0])]?.moves || mainPokemon.vgcStats?.moves}
                items={mainPokemon.smogonStats[mainPokemon.formats.indexOf(format || mainPokemon.formats[0])]?.items || mainPokemon.vgcStats?.items}
                abilities={mainPokemon.smogonStats[mainPokemon.formats.indexOf(format || mainPokemon.formats[0])]?.abilities || mainPokemon.vgcStats?.abilities}
                spreads={mainPokemon.smogonStats[mainPokemon.formats.indexOf(format || mainPokemon.formats[0])]?.spreads || mainPokemon.vgcStats?.spreads}
                currentGeneration={currentGeneration}
              />
            </Col>
          </Row>

          <h2 style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span>{capFirstLetter(mainPokemonName)}&apos;s Top Teammates for</span>
            <FormatSelector 
              formats={mainPokemon.formats} 
              currentFormat={format || mainPokemon.formats[0] || ""} 
            />
          </h2>

          <Row>
            {teammates.map((teammate) => {
              if (!teammate.data) return null;

              const firstFormatStats = teammate.data.smogonStats?.[0] || teammate.data.vgcStats;

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
  const selectedFormat = query.format as string | undefined;

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

    // Use selected format or default to first format
    const formatToUse = selectedFormat && mainPokemonData.formats.includes(selectedFormat)
      ? selectedFormat
      : mainPokemonData.formats[0];

    // Find the stats for the selected format
    const formatIndex = mainPokemonData.formats.indexOf(formatToUse);
    const firstFormatStats = mainPokemonData.smogonStats[formatIndex];
    
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
        format: formatToUse || null,
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
