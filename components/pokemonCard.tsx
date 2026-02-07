import { Card, Accordion } from "react-bootstrap";
import { capFirstLetter } from "../utils/helpers";
import { PokemonData } from "../utils/fetchPokemon";
import dynamic from "next/dynamic";
import { useState } from "react";

const StatsChart = dynamic(() => import("./chart"), {
  ssr: false,
});

type StringPercent = {
  [key: string]: number;
};

type PokemonCardProps = {
  pokemonData: PokemonData;
  name: string;
  usage?: number;
  isSmall?: boolean;
  moves?: StringPercent;
  items?: StringPercent;
  abilities?: StringPercent;
  spreads?: StringPercent;
};

const colors = [
  "#FF5959",
  "#F5AC78",
  "#FAE078",
  "#9DB7F5",
  "#A7DB8D",
  "#FA92B2",
];

const createGoodLink = (name: string, baseUrl = ""): string => {
  let poke = name.toLowerCase();
  poke = poke.replace(/[^\w\s-]/gi, "");
  return baseUrl + poke.replace(" ", "-");
};

const SMOGON_ABILITIES_URL = "https://www.smogon.com/dex/sv/abilities/";
const SMOGON_MOVES_URL = "https://www.smogon.com/dex/sv/moves/";
const SMOGON_ITEMS_URL = "https://www.smogon.com/dex/sv/items/";

const PokemonCard = ({
  pokemonData,
  name,
  usage,
  isSmall,
  moves,
  items,
  abilities,
  spreads,
}: PokemonCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const pokemonName =
    typeof pokemonData.data === "string"
      ? name
      : (pokemonData.data?.name ?? pokemonData.species?.name ?? name);

  const species = pokemonData.species;
  const pokemonTypes = species?.types ?? [];
  const sprite =
    typeof pokemonData.data !== "string"
      ? pokemonData.data?.sprites?.other["official-artwork"]?.front_default
      : null;

  const topMoves = moves ? Object.keys(moves).slice(0, 4) : [];
  const topItem = items ? Object.keys(items)[0] : null;
  const topAbility = abilities ? Object.keys(abilities)[0] : null;
  const topSpread = spreads ? Object.keys(spreads)[0] : null;

  const hasUsageData =
    topMoves.length > 0 || topItem || topAbility || topSpread;

  return (
    <Card
      style={{
        backgroundColor: "#2a2a2a",
        border: "1px solid #444",
        height: "100%",
      }}
    >
      <Card.Body>
        <Card.Title style={{ color: "#e0e0e0" }}>
          {capFirstLetter(pokemonName)}
        </Card.Title>
        {usage !== undefined && (
          <Card.Subtitle className="mb-2" style={{ color: "#b0b0b0" }}>
            Usage: {(usage * 100).toFixed(2)}%
          </Card.Subtitle>
        )}

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

        {sprite && (
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <img
              src={sprite}
              alt={pokemonName}
              style={{ maxWidth: "200px", height: "auto" }}
            />
          </div>
        )}

        {species?.baseStats && (
          <div style={{ marginTop: "16px" }}>
            <StatsChart
              stats={species.baseStats}
              bst={(species as unknown as { bst: number })?.bst}
              isSmall={isSmall}
            />
          </div>
        )}

        {hasUsageData && (
          <div style={{ marginTop: "16px" }}>
            <Accordion className="accordion-dark">
              <Accordion.Item
                eventKey="0"
                style={{ backgroundColor: "#1a1a1a", border: "none" }}
              >
                <Accordion.Header
                  onClick={() => setIsOpen(!isOpen)}
                  style={{ 
                    backgroundColor: "#1a1a1a",
                  }}
                >
                  <span style={{ color: "#e0e0e0", fontWeight: "500" }}>Most Common Set</span>
                </Accordion.Header>
                <Accordion.Body
                  style={{ 
                    backgroundColor: "#222", 
                    color: "#e0e0e0",
                    borderTop: "1px solid #555"
                  }}
                >
                  {topMoves.length > 0 && (
                    <div style={{ marginBottom: "12px" }}>
                      <strong>Moves</strong>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "8px",
                          marginTop: "8px",
                        }}
                      >
                        {topMoves.map((move) => (
                          <a
                            key={move}
                            href={createGoodLink(move, SMOGON_MOVES_URL)}
                            target="_blank"
                            rel="noreferrer noopener"
                            style={{ color: "#6b9bd1" }}
                          >
                            {move}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {topAbility && (
                    <div style={{ marginBottom: "12px" }}>
                      <strong>Ability: </strong>
                      <a
                        href={createGoodLink(topAbility, SMOGON_ABILITIES_URL)}
                        target="_blank"
                        rel="noreferrer noopener"
                        style={{ color: "#6b9bd1" }}
                      >
                        {topAbility}
                      </a>
                    </div>
                  )}

                  {topItem && (
                    <div style={{ marginBottom: "12px" }}>
                      <strong>Item: </strong>
                      <a
                        href={createGoodLink(topItem, SMOGON_ITEMS_URL)}
                        target="_blank"
                        rel="noreferrer noopener"
                        style={{ color: "#6b9bd1" }}
                      >
                        {topItem}
                      </a>
                    </div>
                  )}

                  {topSpread && (
                    <div>
                      <strong>Nature / EVs</strong>
                      <div
                        style={{ marginTop: "8px", fontFamily: "monospace" }}
                      >
                        {(() => {
                          const parts = topSpread.split(":");
                          const nature = parts[0];
                          const stats = parts[1].split("/");

                          return (
                            <div style={{ display: "flex", gap: "16px" }}>
                              <span>{nature}:</span>
                              <span style={{ display: "flex", gap: "8px" }}>
                                {stats.map((stat, index) => (
                                  <span
                                    key={index}
                                    style={{ color: colors[index] }}
                                  >
                                    {stat}
                                  </span>
                                ))}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        )}

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

export default PokemonCard;
