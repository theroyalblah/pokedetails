import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import pokemonList from "../pokemon.json";

const Search = () => {
  const router = useRouter();
  const [formVal, setFormVal] = useState("");
  const [isBadInput, setisBadInput] = useState(true);

  const handleSubmit = (_e: React.SyntheticEvent, value?: string | null) => {
    const input = value ?? formVal;
    const str = input.replace(/\s+/g, "-").toLowerCase();

    if (pokemonList.includes(str)) {
      router.push(`/${str}`);
    }
  };

  const handleInputChange = (_e: React.SyntheticEvent, newInputValue: string) => {
    setFormVal(newInputValue)
    setisBadInput(!pokemonList.includes(newInputValue));
  }

  return (
    <div className="search-bar">
      <Autocomplete
        freeSolo
        disablePortal
        options={pokemonList}
        sx={{ width: 300 }}
        onInputChange={handleInputChange}
        onChange={handleSubmit}
        renderInput={(params) => (
          <TextField
            {...params}
            onSubmit={handleSubmit}
            label="Search Pokemon"
          />
        )}
      />

      <Button
        variant={!isBadInput ? "primary" : "secondary"}
        type="submit"
        disabled={isBadInput}
        onClick={handleSubmit}
        className="search-bar__submit-btn"
      >
        Submit
      </Button>
    </div>
  );
};

export default Search;
