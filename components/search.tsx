import { useRouter } from "next/router";
import { useState, useEffect, useMemo } from "react";
import { Button } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { 
  generatePokemonAutocompleteOptions,
  filterPokemonOptions,
  PokemonAutocompleteOption 
} from "../utils/pokemonAutocomplete";
import { normalizePokemonSearchInput } from "../utils/helpers";
import {
  getPokemonReleaseGeneration,
  getResolvedGenerationForPokemon,
} from "../utils/pokemonGeneration";

type SearchProps = {
  route?: string;
  currentGeneration?: number;
  onSearchPokemonChange?: (pokemonName?: string) => void;
};

const Search = ({
  route = "",
  currentGeneration = 9,
  onSearchPokemonChange,
}: SearchProps) => {
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

  const handleSubmit = (
    event?: React.SyntheticEvent,
    value?: string | PokemonAutocompleteOption | null,
  ) => {
    event?.preventDefault?.();

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

    onSearchPokemonChange?.(pokemonName);

    setIsLoading(true);

    const resolvedGeneration = getResolvedGenerationForPokemon(
      pokemonName,
      currentGeneration,
    );

    if (route) {
      router.push(`${route}?pokemon=${pokemonName}&gen=${resolvedGeneration}`);
    } else {
      router.push(`/${pokemonName}?gen=${resolvedGeneration}`);
    }
  };

  const handleSelectionChange = (
    _e: React.SyntheticEvent,
    value: string | PokemonAutocompleteOption | null,
  ) => {
    let nextValue = "";

    if (typeof value === "string") {
      nextValue = value;
    } else if (value && typeof value === "object") {
      nextValue = value.label;
    }

    setFormVal(nextValue);
    onSearchPokemonChange?.(resolveSearchedPokemonName(nextValue));
  };

  const resolveSearchedPokemonName = (inputValue: string): string | undefined => {
    if (!inputValue.trim()) {
      return undefined;
    }

    const normalizedPokemonName = normalizePokemonSearchInput(inputValue);

    if (!getPokemonReleaseGeneration(normalizedPokemonName)) {
      return undefined;
    }

    return normalizedPokemonName;
  };

  const handleInputChange = (
    _e: React.SyntheticEvent,
    newInputValue: string,
  ) => {
    setFormVal(newInputValue);
    onSearchPokemonChange?.(resolveSearchedPokemonName(newInputValue));
  };

  return (
    <form
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        minWidth: 150,
        flex: "1 1 auto",
      }}
      onSubmit={handleSubmit}
    >
      <Autocomplete
        freeSolo
        options={autocompleteOptions}
        inputValue={formVal}
        getOptionLabel={(option) => 
          typeof option === "string" ? option : option.label
        }
        filterOptions={filterPokemonOptions}
        sx={{
          flex: 1,
          minWidth: 150,
        }}
        onInputChange={handleInputChange}
        onChange={handleSelectionChange}
        disabled={isLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            name="Pokemon"
            label="Pokemon"
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading && (
                      <CircularProgress
                        color="inherit"
                        size={18}
                        sx={{ mr: 1 }}
                      />
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />

      <Button
        variant={"primary"}
        type="submit"
        className="search-bar__submit-btn"
        disabled={isLoading}
        style={{ flexShrink: 0 }}
      >
        Search
      </Button>
    </form>
  );
};

export default Search;
