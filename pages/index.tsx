import type { NextPage } from "next";
import { Container } from "react-bootstrap";
import Navigation from "../components/navigation";
import PokemonSearch from "../components/pokemonSearch";
import { useRouter } from "next/router";
import SiteMeta, { DEFAULT_SITE_DESCRIPTION } from "../components/siteMeta";

const Home: NextPage = () => {
  const router = useRouter();
  const currentGeneration = parseInt((router.query.gen as string) || "9", 10);

  return (
    <>
      <SiteMeta
        title="PokeDetails"
        description={DEFAULT_SITE_DESCRIPTION}
        path="/"
      />

      <Navigation />

      <main className="poke-details">
        <Container>
          <h1>PokeDetails</h1>

          <p>Search a pokemon and view it's most popular moves, items, abilities, and spreads in smogon competitive singles and VGC.</p>

          <PokemonSearch currentGeneration={currentGeneration} />

          <p style={{ marginTop: "32px", fontSize: "0.9em", color: "#666" }}>
            Powered by{" "}
            <a href="https://github.com/pkmn/smogon">
              https://github.com/pkmn/smogon
            </a>{" "}
            and{" "}
            <a href="https://github.com/PokeAPI/pokedex-promise-v2">
              https://github.com/PokeAPI/pokedex-promise-v2
            </a>
          </p>
        </Container>
      </main>
    </>
  );
};

export default Home;
