/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import { Container, Row, Col } from "react-bootstrap";
import {
  formatPokemonDisplayName,
  normalizePokemonSearchInput,
  setCacheHeaders,
} from "../utils/helpers";
import UsageDetails from "../components/usageDetails";
import PokemonSearch from "../components/pokemonSearch";
import Head from "next/head";
import { fetchPokemon, PokemonData } from "../utils/fetchPokemon";
import MainPokemonCard from "../components/mainPokemonCard";
import PageTitle from "../components/pageTitle";
import Navigation from "../components/navigation";
import {
  getResolvedGenerationForPokemon,
  LATEST_GENERATION,
} from "../utils/pokemonGeneration";

type PokeDetailsProps = PokemonData & {
  currentGeneration: number;
  error?: string | null;
};

const PokeDetails = ({
  data,
  smogonStats,
  vgcStats,
  vgcFormat,
  formats,
  species,
  currentGeneration,
  error,
  smogonName,
}: PokeDetailsProps) => {
  if (error) {
    return (
      <>
        <Navigation />
        <main className="poke-details">
          <Container>
            <PageTitle>PokeDetails</PageTitle>

            <PokemonSearch currentGeneration={currentGeneration} />

            <p>We didn&lsquo;t find a Pokémon with that name</p>
          </Container>
        </main>
      </>
    );
  }

  const name = data?.name || data?.species?.name;
  const displayName = formatPokemonDisplayName(name || "");
  const hasSmogonStats =
    smogonStats && smogonStats.length > 0 && !smogonStats[0]?.error;
  const hasVgcStats = vgcStats && !vgcStats?.error;
  const hasNoResults = !hasSmogonStats && !hasVgcStats;

  return (
    <>
      <Head>
        <title>Pokedetails - {displayName}</title>
        <meta
          property="og:title"
          content={`Pokedetails - ${displayName}`}
          key="title"
        />
      </Head>

      <Navigation />

      <main className="poke-details">
        <Container>
          <PageTitle>PokeDetails</PageTitle>

          <PokemonSearch currentGeneration={currentGeneration} />

          <Row className="mb-4">
            <Col sm={12}>
              <MainPokemonCard
                pokemonData={{
                  data,
                  smogonStats,
                  formats,
                  vgcStats,
                  species,
                  smogonName,
                }}
                pokemonName={name || ""}
                displayPokemonName={displayName}
                moves={smogonStats[0]?.moves || vgcStats?.moves}
                items={smogonStats[0]?.items || vgcStats?.items}
                abilities={smogonStats[0]?.abilities || vgcStats?.abilities}
                spreads={smogonStats[0]?.spreads || vgcStats?.spreads}
                showSprites={true}
                linkUrl={`/teamgenerator?pokemon=${smogonName?.toLowerCase()}&gen=${currentGeneration}`}
                linkText="Generate a team with this Pokémon →"
                currentGeneration={currentGeneration}
              />
            </Col>
          </Row>

          {hasNoResults && (
            <Row className="mb-4">
              <Col sm={12}>
                <p>
                  There aren't any competitive usage statistics for {name}. This
                  is likely because this Pokémon is either not fully evolved or
                  not used in competitive play.
                </p>
              </Col>
            </Row>
          )}

          {hasSmogonStats &&
            smogonStats.map((format, i) => {
              return (
                <div key={formats[i]}>
                  <h2>{formats[i]}</h2>

                  <UsageDetails
                    {...format}
                    currentGeneration={currentGeneration}
                  />

                  <div className="divider" />
                </div>
              );
            })}

          {hasVgcStats && (
            <>
              <h2>{vgcFormat || "VGC Stats"}</h2>

              <Row>
                <UsageDetails
                  {...vgcStats}
                  currentGeneration={currentGeneration}
                />
              </Row>
            </>
          )}
        </Container>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  setCacheHeaders(res);

  const pokemonParam = Array.isArray(query.pokemon)
    ? query.pokemon[0]
    : query.pokemon;
  const genParam = Array.isArray(query.gen) ? query.gen[0] : query.gen;
  const pokemonName = normalizePokemonSearchInput(
    (pokemonParam ?? "").toLowerCase(),
  );
  const requestedGeneration = parseInt(
    genParam || LATEST_GENERATION.toString(),
    10,
  );
  const generation = getResolvedGenerationForPokemon(
    pokemonName,
    requestedGeneration,
  );

  if (generation !== requestedGeneration && pokemonName) {
    return {
      redirect: {
        destination: `/${pokemonName}?gen=${generation}`,
        permanent: false,
      },
    };
  }

  const results = await fetchPokemon([pokemonName], generation, true);
  const error = "error" in results[0].data ? results[0].data.error : null;

  return {
    props: {
      ...(results[0] as PokemonData),
      error,
      currentGeneration: generation,
    },
  };
};

export default PokeDetails;
