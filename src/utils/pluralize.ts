export function pluralize(word: string, plural: boolean): string {
  return plural ? `${word}s` : word;
}
