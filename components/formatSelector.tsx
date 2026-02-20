import { useRouter } from "next/router";
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

const FORM_CONTROL_STYLES = {
  minWidth: 220,
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
};

const SPINNER_STYLES = {
  color: "#e0e0e0",
  marginRight: "12px",
  display: "flex",
};

const MENU_PAPER_STYLES = {
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
};

type FormatSelectorProps = {
  formats: string[];
  currentFormat: string;
};

const FormatSelector = ({ formats, currentFormat }: FormatSelectorProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const handleChange = (event: { target: { value: unknown } }) => {
    const newFormat = event.target.value as string;
    const currentPath = router.pathname;
    const query = { ...router.query, format: newFormat };

    router.push({
      pathname: currentPath,
      query,
    });
  };

  if (formats.length === 0) {
    return null;
  }

  return (
    <FormControl 
      size="medium" 
      sx={FORM_CONTROL_STYLES}
    >
      <InputLabel id="format-select-label">Format</InputLabel>

      <Select
        labelId="format-select-label"
        id="format-select"
        value={currentFormat}
        label="Format"
        onChange={handleChange}
        disabled={isLoading}
        IconComponent={isLoading ? () => (
          <CircularProgress 
            size={20} 
            sx={SPINNER_STYLES}
          />
        ) : undefined}
        MenuProps={{
          PaperProps: {
            sx: MENU_PAPER_STYLES,
          },
        }}
      >
        {formats.map((format) => (
          <MenuItem key={format} value={format}>
            {format}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FormatSelector;
