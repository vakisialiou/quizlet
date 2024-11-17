
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min
}

export function randomArrayElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export const getRandomArbitrary = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}
