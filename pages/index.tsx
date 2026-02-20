import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Container } from "react-bootstrap";
import Search from "../components/search";
import Navigation from "../components/navigation";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Pokedetails</title>
        <meta property="og:title" content="Pokedetails" key="title" />
      </Head>

      <Navigation />

      <main className="poke-details">
        <Container>
          <h1>PokeDetails</h1>

          <p>Search a pokemon and view it's most popular moves, items, abilities, and spreads in smogon competitive singles and VGC.</p>

          <Search />

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
