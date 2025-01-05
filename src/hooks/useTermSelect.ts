import { RelationTermData } from '@entities/RelationTerm'
import { ConfigType } from '@store/initial-state'
import { useSelector } from 'react-redux'
import { TermData } from '@entities/Term'
import { useMemo } from 'react'

type TypeTermSelect = { terms: TermData[], relationTerms: RelationTermData[] }

export function useTermSelect(): TypeTermSelect {
  const terms = useSelector((state: ConfigType) => state.terms)
  const relationTerms = useSelector((state: ConfigType) => state.relationTerms)

  return useMemo(() => {
    return { terms, relationTerms }
  }, [terms, relationTerms])
}
