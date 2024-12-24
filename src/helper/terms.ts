import { ClientTermData } from '@entities/ClientTerm'

export const filterEmptyTerms = (terms: ClientTermData[]): ClientTermData[] => {
  return [...terms || []].filter(({ answer, question }) => {
    return answer && question
  })
}

export const filterDeletedTerms = (terms: ClientTermData[]): ClientTermData[] => {
  return [...terms || []].filter(({ deleted }) => !deleted)
}

export function findTermsByIds(items: ClientTermData[], ids: string[]): ClientTermData[] {
  return [...ids]
    .map((id) => {
      const index = items.findIndex((item) => item.id === id)
      return index !== -1 ? items[index] : null
    })
    .filter((item) => !!item)
}
