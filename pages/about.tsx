import Head from "next/head";
import { Container } from "react-bootstrap";
import Navigation from "../components/navigation";

const About = () => {
  return (
    <>
      <Head>
        <title>Pokedetails - About</title>
        <meta
          property="og:title"
          content="Pokedetails - About"
          key="title"
        />
      </Head>

      <Navigation />

      <main className="poke-details">
        <Container>
          <h1>About PokeDetails</h1>
          <p>
            This page is under construction. More information coming soon!
          </p>
        </Container>
      </main>
    </>
  );
};

export default About;
