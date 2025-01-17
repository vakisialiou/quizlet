import { RelatedTermData, RelationTermData } from '@entities/RelationTerm'
import { TermData } from '@entities/Term'

export const sortTerms = (items: TermData[]): TermData[] => {
  return [...items].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })
}

export const sortTermsWithRelations = (items: { term: TermData, relation: RelationTermData }[]): RelatedTermData[] => {
  return [...items].sort((a, b) => {
    if (a.relation.order === b.relation.order) {
      return new Date(a.relation.createdAt).getTime() - new Date(b.relation.createdAt).getTime()
    }
    return a.relation.order - b.relation.order
  })
}
