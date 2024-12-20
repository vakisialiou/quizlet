import { ClientTermData } from '@entities/ClientTerm'

export const filterEmptyTerms = (terms: ClientTermData[]): ClientTermData[] => {
  return [...terms || []].filter(({ answer, question }) => {
    return answer && question
  })
}

export const filterDeletedTerms = (terms: ClientTermData[]): ClientTermData[] => {
  return [...terms || []].filter(({ deleted }) => !deleted)
}
