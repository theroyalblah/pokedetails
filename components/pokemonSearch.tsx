import Search from "./search";
import GenerationSelector from "./generationSelector";

type PokemonSearchProps = {
  currentGeneration?: number;
  route?: string;
};

const PokemonSearch = ({ currentGeneration = 9, route }: PokemonSearchProps) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        marginBottom: "16px",
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}
    >
      <Search route={route} currentGeneration={currentGeneration} />

      <GenerationSelector currentGeneration={currentGeneration} />
    </div>
  );
};

export default PokemonSearch;
