/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import { Container, Row, Col } from "react-bootstrap";
import { capFirstLetter } from "../utils/helpers";
import UsageDetails from "../components/usageDetails";
import Search from "../components/search";
import Head from "next/head";
import { fetchPokemon, PokemonData } from "../utils/fetchPokemon";
import MainPokemonCard from "../components/mainPokemonCard";

type PokeDetailsProps = PokemonData;

const PokeDetails = ({
  data,
  smogonStats,
  vgcStats,
  formats,
  species,
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

      <main className="poke-details">
        <Container>
          <h1>PokeDetails</h1>

          <Search />

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
                moves={smogonStats[0]?.moves}
                items={smogonStats[0]?.items}
                abilities={smogonStats[0]?.abilities}
                spreads={smogonStats[0]?.spreads}
                showSprites={true}
                linkUrl={`/teambuilder?pokemon=${name?.toLowerCase()}`}
                linkText="Build a team with this Pokémon →"
              />
            </Col>
          </Row>

          <div className="divider" />

          {!!name && (
            <a
              href={`https://www.smogon.com/dex/sv/pokemon/${name}`}
              rel="noreferrer"
              target="_blank"
            >
              View on Smogon
            </a>
          )}

          {!!smogonStats &&
            smogonStats.map((format, i) => {
              return (
                <div key={formats[i]}>
                  <h2>{formats[i]}</h2>

                  <UsageDetails {...format} />

                  <div className="divider" />
                </div>
              );
            })}

          {vgcStats && (
            <>
              <h3>VGC Stats</h3>

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
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const pokemonName = (query.pokemon as string) ?? "".toLowerCase();

  const results = await fetchPokemon([pokemonName]);

  return {
    props: results[0],
  };
};

export default PokeDetails;
