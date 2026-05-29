// equal to $tw.utils.toTitleCase
export function capitalize(str: string) {
  return str.replace(/^\w/, (match) => match.toUpperCase());
}
