export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min
}

export function randomString(length: number): string {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

/**
 * @param {number} percentOfGettingTrue set float number! not integer
 */
export function randomBoolean(percentOfGettingTrue: number = 0.5): boolean {
  if (percentOfGettingTrue > 1.0) {
    throw new Error('percentOfGetingTure parameter has to be less than 1.0')
  }
  return Boolean(Math.random() < percentOfGettingTrue)
}
