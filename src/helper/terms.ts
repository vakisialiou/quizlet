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
