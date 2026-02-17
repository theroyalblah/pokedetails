import { useRouter } from "next/router";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const GENERATIONS = [
  { value: 9, label: "Generation 9 (Scarlet/Violet)" },
  { value: 8, label: "Generation 8 (Sword/Shield)" },
  { value: 7, label: "Generation 7 (Sun/Moon)" },
  { value: 6, label: "Generation 6 (X/Y)" },
  { value: 5, label: "Generation 5 (Black/White)" },
  { value: 4, label: "Generation 4 (Diamond/Pearl)" },
  { value: 3, label: "Generation 3 (Ruby/Sapphire)" },
  { value: 2, label: "Generation 2 (Gold/Silver)" },
  { value: 1, label: "Generation 1 (Red/Blue)" },
];

type GenerationSelectorProps = {
  currentGeneration?: number;
};

const GenerationSelector = ({ currentGeneration = 9 }: GenerationSelectorProps) => {
  const router = useRouter();

  const handleChange = (event: { target: { value: unknown } }) => {
    const newGen = event.target.value as number;
    const currentPath = router.pathname;
    const query = { ...router.query, gen: newGen.toString() };

    router.push({
      pathname: currentPath,
      query,
    });
  };

  return (
    <FormControl 
      size="small" 
      sx={{ 
        minWidth: 280,
        backgroundColor: "#2a2a2a",
        borderRadius: "4px",
        "& .MuiOutlinedInput-root": {
          color: "#e0e0e0",
          "& fieldset": {
            borderColor: "#555",
          },
          "&:hover fieldset": {
            borderColor: "#6b9bd1",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#6b9bd1",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#b0b0b0",
        },
        "& .MuiSelect-icon": {
          color: "#e0e0e0",
        },
      }}
    >
      <InputLabel id="generation-select-label">Generation</InputLabel>
      <Select
        labelId="generation-select-label"
        id="generation-select"
        value={currentGeneration}
        label="Generation"
        onChange={handleChange}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: "#2a2a2a",
              color: "#e0e0e0",
              "& .MuiMenuItem-root": {
                "&:hover": {
                  backgroundColor: "#3a3a3a",
                },
                "&.Mui-selected": {
                  backgroundColor: "#3a3a3a",
                  "&:hover": {
                    backgroundColor: "#4a4a4a",
                  },
                },
              },
            },
          },
        }}
      >
        {GENERATIONS.map((gen) => (
          <MenuItem key={gen.value} value={gen.value}>
            {gen.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GenerationSelector;
