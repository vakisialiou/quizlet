import { RelationTermData } from '@entities/RelationTerm'
import { useSelector } from 'react-redux'
import { TermData } from '@entities/Term'
import { useMemo } from 'react'

type TypeTermSelect = { terms: TermData[], relationTerms: RelationTermData[] }

export function useTermSelect(): TypeTermSelect {
  const terms = useSelector((state: TypeTermSelect) => state.terms)
  const relationTerms = useSelector((state: TypeTermSelect) => state.relationTerms)

  return useMemo(() => {
    return { terms, relationTerms }
  }, [terms, relationTerms])
}
