import { useRouter } from "next/router";
import { useState, useEffect, useMemo } from "react";
import { Button, Spinner } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { 
  generatePokemonAutocompleteOptions,
  filterPokemonOptions,
  PokemonAutocompleteOption 
} from "../utils/pokemonAutocomplete";
import { normalizePokemonSearchInput } from "../utils/helpers";

type SearchProps = {
  route?: string;
  currentGeneration?: number;
};

const Search = ({ route = "", currentGeneration = 9 }: SearchProps) => {
  const router = useRouter();
  const [formVal, setFormVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 
  const autocompleteOptions = useMemo(() => generatePokemonAutocompleteOptions(), []);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("routeChangeError", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("routeChangeError", handleRouteChange);
    };
  }, [router.events]);

  const handleSubmit = (_e: React.SyntheticEvent, value?: string | PokemonAutocompleteOption | null) => {
    let pokemonName = "";
    
    // I don't know why but the form submits when hitting the final backspace on a string of input, searching for just the last letter.
    if (typeof value === "string") {
       // User typed freely
      if (value.trim() === "") return;
      if (value.length < 3) return;
      
      pokemonName = normalizePokemonSearchInput(value);
    } else if (value && typeof value === "object") {
      // User selected from dropdown
      pokemonName = value.value;
    } else {
      if (formVal.length < 3) return;
      // Fallback to form value
      pokemonName = normalizePokemonSearchInput(formVal);
    }

    if (!pokemonName) return;

    setIsLoading(true);

    if (route) {
      router.push(`${route}?pokemon=${pokemonName}&gen=${currentGeneration}`);
    } else {
      router.push(`/${pokemonName}?gen=${currentGeneration}`);
    }
  };

  const handleInputChange = (
    _e: React.SyntheticEvent,
    newInputValue: string,
  ) => {
    setFormVal(newInputValue);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        minWidth: 150,
        flex: "1 1 auto",
      }}
    >
      <Autocomplete
        freeSolo
        options={autocompleteOptions}
        getOptionLabel={(option) => 
          typeof option === "string" ? option : option.label
        }
        filterOptions={filterPokemonOptions}
        sx={{
          flex: 1,
          minWidth: 150,
        }}
        onInputChange={handleInputChange}
        onChange={handleSubmit}
        disabled={isLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            name="Search Pokemon"
            onSubmit={handleSubmit}
            label="Search Pokemon"
          />
        )}
      />

      <Button
        variant={"primary"}
        type="submit"
        onClick={handleSubmit}
        className="search-bar__submit-btn"
        disabled={isLoading}
        style={{ flexShrink: 0 }}
      >
        Submit
      </Button>

      {isLoading && (
        <Spinner animation="border" role="status" style={{ flexShrink: 0 }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
    </div>
  );
};

export default Search;
