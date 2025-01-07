import { RelationTermData } from '@entities/RelationTerm'
import { clientFetch } from '@lib/fetch-client'

export const createRelationTermData = async (relationTerm: RelationTermData): Promise<boolean> => {
  const res = await clientFetch(`/api/relation/terms`, {
    method: 'PUT',
    body: JSON.stringify({ relationTerm })
  })

  return res.ok
}

export const removeRelationTermData = async (relationTerm: RelationTermData): Promise<boolean> => {
  const res = await clientFetch(`/api/relation/terms`, {
    method: 'DELETE',
    body: JSON.stringify({ relationTerm })
  })

  return res.ok
}
