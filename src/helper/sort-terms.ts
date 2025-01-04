import { TermData } from '@entities/Term'

export const sortTerms = (items: TermData[]): TermData[] => {
  return [...items].sort((a, b) => {
    if (a.order === b.order) {
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
    }
    return a.order - b.order
  })
}
