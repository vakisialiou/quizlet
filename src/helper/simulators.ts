import { shuffle } from '@lib/array'


export const randomizeTermIds = (availableTermIds: string[]): string[] => {
  return shuffle(availableTermIds)
}

export const selectRandomTermId = (availableTermIds: string[]): string | null => {
  if (availableTermIds.length > 0) {
    const termIds = randomizeTermIds(availableTermIds)
    return termIds[0]
  }
  return null
}
