import { chunks, shuffle } from '@lib/array'
import { TermData } from '@entities/Term'

export const filterEmptyTerms = (terms: TermData[]): TermData[] => {
  return [...terms || []].filter(({ answer, question }) => {
    return answer && question
  })
}

export const filterDeletedTerms = (terms: TermData[]): TermData[] => {
  return [...terms || []].filter(({ deleted }) => !deleted)
}

export function findTermsByIds(items: TermData[], ids: string[]): TermData[] {
  return [...ids]
    .map((id) => {
      const index = items.findIndex((item) => item.id === id)
      return index !== -1 ? items[index] : null
    })
    .filter((item) => !!item)
}

export function splitTermsToChunks(terms: TermData[], size: number) {
  if (terms.length === 0) {
    return []
  }

  if (terms.length <= size) {
    return [terms]
  }

  const result = chunks(terms, size)

  if (result.length > 1) {
    const lastChunk = result[result.length - 1]
    if (lastChunk.length < size) {
      const diff = size - lastChunk.length
      const map = [...lastChunk].reduce((accumulate, item) => {
        return { ...accumulate, [item.id]: true }
      }, {} as {[key: string]: boolean})

      const filteredArray = [...terms].filter((item) => !map[item.id])
      const piece = shuffle(filteredArray).slice(0, diff)
      result[result.length - 1].push(...piece)
    }
  }

  return result
}
