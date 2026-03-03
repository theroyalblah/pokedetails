/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import { Container, Row, Col } from "react-bootstrap";
import { formatPokemonDisplayName } from "../utils/helpers";
import UsageDetails from "../components/usageDetails";
import PokemonSearch from "../components/pokemonSearch";
import Head from "next/head";
import { fetchPokemon, PokemonData } from "../utils/fetchPokemon";
import MainPokemonCard from "../components/mainPokemonCard";
import PageTitle from "../components/pageTitle";
import Navigation from "../components/navigation";

type PokeDetailsProps = PokemonData & {
  currentGeneration: number;
};

const PokeDetails = ({
  data,
  smogonStats,
  vgcStats,
  vgcFormat,
  formats,
  species,
  currentGeneration,
}: PokeDetailsProps) => {
  if (!data || typeof data === "string") {
    return (
      <>
        <Navigation />
        <main className="poke-details">
          <Container>
            <PageTitle>PokeDetails</PageTitle>
            <p>We didn&lsquo;t find anything with that name</p>
            <PokemonSearch currentGeneration={currentGeneration} />
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
                }}
                pokemonName={name || ""}
                displayPokemonName={displayName}
                moves={smogonStats[0]?.moves || vgcStats?.moves}
                items={smogonStats[0]?.items || vgcStats?.items}
                abilities={smogonStats[0]?.abilities || vgcStats?.abilities}
                spreads={smogonStats[0]?.spreads || vgcStats?.spreads}
                showSprites={true}
                linkUrl={`/teamgenerator?pokemon=${name?.toLowerCase()}&gen=${currentGeneration}`}
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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const pokemonName = (query.pokemon as string) ?? "".toLowerCase();
  const generation = parseInt((query.gen as string) || "9", 10);

  const results = await fetchPokemon([pokemonName], generation, true);

  return {
    props: {
      ...results[0],
      currentGeneration: generation,
    },
  };
};

export default PokeDetails;
