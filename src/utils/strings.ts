export function pluralize(word: string, plural: boolean): string {
  return plural ? `${word}s` : word;
}

export function capitalize(s: string): string {
  if (s.length <= 1) {
    return s.toUpperCase()
  }
  return s.charAt(0).toUpperCase() + s.slice(1)
}
