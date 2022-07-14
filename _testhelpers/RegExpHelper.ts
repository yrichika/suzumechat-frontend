export function eitherRegex(eitherThis: string, orThat: string): RegExp {
  return new RegExp('(' + eitherThis + '|' + orThat + ')')
}
