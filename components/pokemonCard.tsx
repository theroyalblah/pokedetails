import { Card, Accordion } from "react-bootstrap";
import { capFirstLetter } from "../utils/helpers";
import { PokemonData } from "../utils/fetchPokemon";
import dynamic from "next/dynamic";
import { useState } from "react";
import MostCommonSet from "./mostCommonSet";

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
  currentGeneration?: number;
};

const PokemonCard = ({
  pokemonData,
  name,
  usage,
  isSmall,
  moves,
  items,
  abilities,
  spreads,
  currentGeneration = 9,
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

        {(moves || items || abilities || spreads) && (
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
                  <MostCommonSet 
                    moves={moves}
                    items={items}
                    abilities={abilities}
                    spreads={spreads}
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        )}

        <div style={{ marginTop: "16px" }}>
          <a
            href={`/${pokemonName.toLowerCase()}?gen=${currentGeneration}`}
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
