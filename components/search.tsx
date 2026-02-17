import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import pokemonList from "../pokemon.json";

type SearchProps = {
  route?: string;
};

const Search = ({ route = "" }: SearchProps) => {
  const router = useRouter();
  const [formVal, setFormVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsLoading(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('routeChangeError', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('routeChangeError', handleRouteChange);
    };
  }, [router.events]);

  const handleSubmit = (_e: React.SyntheticEvent, value?: string | null) => {
    const input = value ?? formVal;
    const str = input.replace(/\s+/g, "-").toLowerCase();

    if (!str) return;

    setIsLoading(true);

    if (route) {
      router.push(`${route}?pokemon=${str}`);
    } else {
      router.push(`/${str}`);
    }
  };

  const handleInputChange = (_e: React.SyntheticEvent, newInputValue: string) => {
    setFormVal(newInputValue);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Autocomplete
        freeSolo
        disablePortal
        options={pokemonList}
        sx={{ width: 300 }}
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
      >
        Submit
      </Button>

      {isLoading && (
        <Spinner
          animation="border"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
    </div>
  );
};

export default Search;
