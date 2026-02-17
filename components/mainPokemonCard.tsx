import { Card, Row, Col } from "react-bootstrap";
import { capFirstLetter } from "../utils/helpers";
import { PokemonData } from "../utils/fetchPokemon";
import dynamic from "next/dynamic";
import MostCommonSet from "./mostCommonSet";

const StatsChart = dynamic(() => import("./chart"), {
  ssr: false,
});

type StringPercent = {
  [key: string]: number;
};

type MainPokemonCardProps = {
  pokemonData: PokemonData;
  name: string;
  moves?: StringPercent;
  items?: StringPercent;
  abilities?: StringPercent;
  spreads?: StringPercent;
  showSprites?: boolean;
};

const SMALL_POKEMON_IMAGE_SIZE = 120;

const boxStyle = {
  backgroundColor: "#222",
  padding: "16px",
  borderRadius: "4px",
  border: "1px solid #555",
};

const MainPokemonCard = ({
  pokemonData,
  name,
  moves,
  items,
  abilities,
  spreads,
  showSprites = false,
}: MainPokemonCardProps) => {
  const pokemonName =
    typeof pokemonData.data === "string"
      ? name
      : (pokemonData.data?.name ?? pokemonData.species?.name ?? name);

  const species = pokemonData.species;
  const pokemonTypes = species?.types ?? [];
  const data = typeof pokemonData.data !== "string" ? pokemonData.data : null;
  const sprite = data?.sprites?.other["official-artwork"]?.front_default;
  const sprites = data?.sprites;

  const showMostCommonSet = moves || items || abilities || spreads;

  return (
    <Card
      style={{
        backgroundColor: "#2a2a2a",
        border: "1px solid #444",
      }}
    >
      <Card.Body>
        <Card.Title style={{ color: "#e0e0e0", fontSize: "3rem" }}>
          {capFirstLetter(pokemonName)}
        </Card.Title>

        <div className="types-container">
          {pokemonTypes.map((type) => {
            const t = type.toLowerCase();

            return (
              <span key={t} className="types">
                <span className={`types__${t}`}>{capFirstLetter(t)}</span>
              </span>
            );
          })}
        </div>

        <Row style={{ marginTop: "16px" }}>
          <Col md={5} style={{ textAlign: "center" }}>
            {sprite && (
              <img
                src={sprite}
                alt={pokemonName}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}

            {showSprites && sprites && (
              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {sprites.front_default && (
                  <img
                    width={SMALL_POKEMON_IMAGE_SIZE}
                    height={SMALL_POKEMON_IMAGE_SIZE}
                    alt="front default"
                    src={sprites.front_default}
                  />
                )}

                {sprites.back_default && (
                  <img
                    width={SMALL_POKEMON_IMAGE_SIZE}
                    height={SMALL_POKEMON_IMAGE_SIZE}
                    alt="back default"
                    src={sprites.back_default}
                  />
                )}

                {sprites.front_shiny && (
                  <img
                    width={SMALL_POKEMON_IMAGE_SIZE}
                    height={SMALL_POKEMON_IMAGE_SIZE}
                    alt="front shiny"
                    src={sprites.front_shiny}
                  />
                )}

                {sprites.back_shiny && (
                  <img
                    width={SMALL_POKEMON_IMAGE_SIZE}
                    height={SMALL_POKEMON_IMAGE_SIZE}
                    alt="back shiny"
                    src={sprites.back_shiny}
                  />
                )}
              </div>
            )}
          </Col>

          <Col md={7}>
            {species?.baseStats && (
              <div
                style={{
                  marginBottom: "16px",
                  ...boxStyle,
                }}
              >
                <StatsChart
                  stats={species.baseStats}
                  bst={(species as unknown as { bst: number })?.bst}
                  isSmall={false}
                />
              </div>
            )}

            {showMostCommonSet && (
              <div
                style={boxStyle}
              >
                <h5 style={{ color: "#e0e0e0", marginBottom: "12px" }}>
                  Most Common Set
                </h5>

                <MostCommonSet
                  moves={moves}
                  items={items}
                  abilities={abilities}
                  spreads={spreads}
                />
              </div>
            )}
          </Col>
        </Row>

        <div style={{ marginTop: "16px" }}>
          <a
            href={`/${pokemonName.toLowerCase()}`}
            style={{ color: "#6b9bd1" }}
          >
            View Details →
          </a>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MainPokemonCard;
