import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Container } from "react-bootstrap";
import Search from "../components/search";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Pokedetails</title>
        <meta property="og:title" content="Pokedetails" key="title" />
      </Head>

      <Container>
        <Search />

        <p>
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
    </>
  );
};

export default Home;
