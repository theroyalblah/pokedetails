export const capFirstLetter = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

export const removeDashes = (text: string): string => text.replace("-", "");
