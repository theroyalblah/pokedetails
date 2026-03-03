import competitivePokemon from "../competitivePokemon.json";
import { formatPokemonDisplayName } from "./helpers";

export type PokemonAutocompleteOption = {
  label: string;      // Display name (e.g., "Mega Charizard X")
  value: string;      // API name (e.g., "charizard-mega-x")
  searchTerms: string; // Additional search terms for matching
};

/**
 * Generates autocomplete options with both display names and API names
 * Allows users to search by either format
 */
export const generatePokemonAutocompleteOptions = (): PokemonAutocompleteOption[] => {
  const options: PokemonAutocompleteOption[] = [];
  
  for (const apiName of competitivePokemon) {
    const displayName = formatPokemonDisplayName(apiName);
    
    // Create search terms including both formats
    const searchTerms = [
      apiName,                              // charizard-mega-x
      displayName.toLowerCase(),            // mega charizard x
      apiName.replace(/-/g, " "),          // charizard mega x
    ].join(" ");
    
    options.push({
      label: displayName,
      value: apiName,
      searchTerms: searchTerms,
    });
  }
  
  return options;
};

/**
 * Custom filter function for MUI Autocomplete that matches against multiple search terms
 */
export const filterPokemonOptions = (
  options: PokemonAutocompleteOption[],
  { inputValue }: { inputValue: string }
): PokemonAutocompleteOption[] => {
  if (!inputValue) return options;
  
  const searchQuery = inputValue.toLowerCase().trim();
  
  return options.filter(option => {
    // Match against display name
    if (option.label.toLowerCase().includes(searchQuery)) {
      return true;
    }
    
    // Match against API name
    if (option.value.toLowerCase().includes(searchQuery)) {
      return true;
    }
    
    // Match against any search terms
    if (option.searchTerms.includes(searchQuery)) {
      return true;
    }
    
    // Try word-based matching for partial matches
    const searchWords = searchQuery.split(/\s+/);
    const optionWords = option.searchTerms.toLowerCase().split(/\s+/);
    
    // All search words must be found in option words
    return searchWords.every(searchWord => 
      optionWords.some(optionWord => optionWord.includes(searchWord))
    );
  });
};
