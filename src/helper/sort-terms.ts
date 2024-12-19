import { ClientTermData } from '@entities/ClientTerm'

export const sortTerms = (items: ClientTermData[]): ClientTermData[] => {
  return [...items].sort((a, b) => {
    if (a.order === b.order) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    return a.order - b.order
  })
}
