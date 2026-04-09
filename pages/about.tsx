import { Container } from "react-bootstrap";
import Navigation from "../components/navigation";
import SiteMeta from "../components/siteMeta";

const pkmnShowdownLink = "https://pokemonshowdown.com/intro";
const ABOUT_DESCRIPTION =
  "Learn what PokeDetails does, where its competitive usage data comes from, and how the team generator is intended to be used.";

const About = () => {
  return (
    <>
      <SiteMeta
        title="PokeDetails - About"
        description={ABOUT_DESCRIPTION}
        path="/about"
      />

      <Navigation />

      <main className="poke-details">
        <Container>
          <h1>About PokeDetails</h1>
          <p>
            This website displays smogon usage statistics for competitive
            singles and VGC. Usage statistics are updated monthly and are based
            on battle data from Pokémon Showdown.
          </p>
          <p>
            The team generator is constructed simply using the top 5 teammates
            for a particular Pokémon and most used sets by percentage, so take
            it with a grain of salt. It doesn't take into account team synergy
            or strategy. It's probably best used as a starting point or just to
            try out something new.
          </p>
          <p>
            If you're new to the world of competitive Pokémon, consider reading
            the following articles
          </p>
          <ul>
            <li>
              <a
                href={pkmnShowdownLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {pkmnShowdownLink}
              </a>
            </li>

            <li>
              <a
                href="https://www.smogon.com/dp/articles/intro_comp_pokemon"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.smogon.com/dp/articles/intro_comp_pokemon
              </a>
            </li>
          </ul>
        </Container>
      </main>
    </>
  );
};

export default About;
