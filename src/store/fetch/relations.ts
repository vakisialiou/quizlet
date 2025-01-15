import { RelationFolderData } from '@entities/RelationFolder'
import { RelationTermData } from '@entities/RelationTerm'
import { clientFetch } from '@lib/fetch-client'

export const createRelationTermData = async (relation: RelationTermData): Promise<boolean> => {
  const res = await clientFetch(`/api/relation/terms`, {
    method: 'PUT',
    body: JSON.stringify({ relation })
  })

  return res.ok
}

export const removeRelationTermData = async (relation: RelationTermData): Promise<boolean> => {
  const res = await clientFetch(`/api/relation/terms`, {
    method: 'DELETE',
    body: JSON.stringify({ relation })
  })

  return res.ok
}

export const createRelationFolderData = async (relation: RelationFolderData): Promise<boolean> => {
  const res = await clientFetch(`/api/relation/folders`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ relation })
  })

  return res.ok
}

export const removeRelationFolderData = async (relation: RelationFolderData): Promise<boolean> => {
  const res = await clientFetch(`/api/relation/folders`, {
    method: 'DELETE',
    body: JSON.stringify({ relation })
  })

  return res.ok
}
