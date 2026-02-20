/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import { Container, Row, Col } from "react-bootstrap";
import { capFirstLetter } from "../utils/helpers";
import UsageDetails from "../components/usageDetails";
import Search from "../components/search";
import Head from "next/head";
import { fetchPokemon, PokemonData } from "../utils/fetchPokemon";
import MainPokemonCard from "../components/mainPokemonCard";
import GenerationSelector from "../components/generationSelector";
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
        We didn&lsquo;t find anything with that name
        <Search />
      </>
    );
  }

  const name = data.name ?? species?.name;

  return (
    <>
      <Head>
        <title>Pokedetails - {!!name ? capFirstLetter(name) : ""}</title>
        <meta
          property="og:title"
          content={`Pokedetails - ${name}`}
          key="title"
        />
      </Head>

      <Navigation />

      <main className="poke-details">
        <Container>
          <PageTitle>PokeDetails</PageTitle>

          <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
            <Search />
            <GenerationSelector currentGeneration={currentGeneration} />
          </div>

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
                name={name || ""}
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

          {!!smogonStats &&
            smogonStats.map((format, i) => {
              return (
                <div key={formats[i]}>
                  <h2>{formats[i]}</h2>

                  <UsageDetails {...format} currentGeneration={currentGeneration} />

                  <div className="divider" />
                </div>
              );
            })}

          {vgcStats && (
            <>
              <h2>{vgcFormat || 'VGC Stats'}</h2>

              <Row>
                {!vgcStats?.error ? (
                  <UsageDetails {...vgcStats} currentGeneration={currentGeneration} />
                ) : (
                  <p>Looks like there&lsquo;s no usage in vgc :(</p>
                )}
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
