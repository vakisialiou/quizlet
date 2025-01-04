import { RelationTermData } from '@entities/RelationTerm'
import { clientFetch } from '@lib/fetch-client'
import { TermData } from '@entities/Term'

export const saveTermData = async (relationTerm: RelationTermData, term: TermData, shareId: string | null): Promise<boolean> => {
  const res = await clientFetch(`/api/terms/${term.id}`, {
    method: 'PUT',
    body: JSON.stringify({ relationTerm, term, shareId })
  })

  return res.ok
}

export const updateTermData = async (relationTerm: RelationTermData, term: TermData, shareId: string | null): Promise<boolean> => {
  const res = await clientFetch(`/api/terms/${term.id}`, {
    method: 'POST',
    body: JSON.stringify({ relationTerm, term, shareId })
  })

  return res.ok
}
