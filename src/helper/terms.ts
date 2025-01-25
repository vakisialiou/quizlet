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

export const findTermIntersections = (terms: TermData[]): {[key: string]: TermData[]} => {
  const res = {} as {[key: string]: TermData[]}

  const push = (ownerId: string, term: TermData) => {
    res[ownerId] = [...res[ownerId] || [], term]
  }

  for (const termA of terms) {
    const answerA = termA.answer || ''
    const questionA = termA.question || ''
    if (answerA === questionA) {
      push(termA.id, termA)
      continue
    }

    for (const termB of terms) {
      if (termA.id === termB.id) {
        continue
      }

      const answerA = termA.answer || ''
      const answerB = termB.answer || ''
      if (answerA === answerB) {
        push(termA.id, termB)
        continue
      }

      const questionA = termA.question || ''
      const questionB = termB.question || ''
      if (questionA === questionB) {
        push(termA.id, termB)
      }
    }
  }
  return res
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
