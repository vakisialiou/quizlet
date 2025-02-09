import { DEFAULT_FILTER, TermFiltersData } from '@entities/TermFilters'
import { RelatedTermData } from '@entities/RelationTerm'
import { TermData } from '@entities/Term'

function termsFilter(search: string, term: TermData, termEditId?: string | null) {
  if (termEditId === term.id) {
    return true
  }

  return `${term.question}`.toLocaleLowerCase().includes(search)
    || `${term.answer}`.toLocaleLowerCase().includes(search)
}

export const searchTerms = (items: TermData[], search: string | null, termEditId?: string | null): TermData[] => {
  if (!search) {
    return items
  }

  return items.filter((term) => {
    return termsFilter(search, term, termEditId)
  })
}

export function searchRelatedTerms(items: RelatedTermData[], search: string | null, termEditId?: string | null): RelatedTermData[] {
  if (!search) {
    return items
  }

  return items.filter(({ term }) => {
    return termsFilter(search, term, termEditId)
  })
}

export function filterRelatedTerms(items: RelatedTermData[], filter: TermFiltersData, termEditId?: string | null): RelatedTermData[] {
  if (filter.color === DEFAULT_FILTER) {
    return items
  }

  return items.filter(({ relation }) => {
    return relation.color === filter.color || termEditId === relation.termId
  })
}
