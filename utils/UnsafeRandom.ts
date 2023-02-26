// TEST:
export function randomInt(min: number = 0, max: number = 1000000): number {
  return Math.floor(Math.random() * (max - min)) + min
}

// TEST:
export function randomString(length: number = 5): string {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

// TEST:
/**
 * @param {number} percentOfGettingTrue set float number! not integer
 */
export function randomBoolean(percentOfGettingTrue: number = 0.5): boolean {
  if (percentOfGettingTrue > 1.0) {
    throw new Error('percentOfGetingTure parameter has to be less than 1.0')
  }
  return Boolean(Math.random() < percentOfGettingTrue)
}

// TEST:
/**
 * Get random property key value set from an object
 */
export function randomProperty(object: any): any {
  const randomKey = randomPropertyKey(object)
  const randomValue = object[randomKey]
  return { [randomKey]: randomValue }
}

// TEST:
/**
 * Get random property value from an object
 */
export function randomPropertyValue(object: any): any {
  return object[randomPropertyKey(object)]
}

// TEST:
/**
 * Get random property key from an object
 */
export function randomPropertyKey(object: any): any {
  const keys = Object.keys(object)
  return keys[(keys.length * Math.random()) << 0]
}
