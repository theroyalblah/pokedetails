export const tiers = [
  "ubers",
  "ou",
  "uu",
  "ru",
  "nu",
  "pu",
  "zu",
];

export const getFormatsForGeneration = (generation: number): string[] => {
  return tiers.map(tier => `gen${generation}${tier}`);
};
