import { FolderGroupData } from '@entities/FolderGroup'
import { clientFetch } from '@lib/fetch-client'

export const upsertFolderGroupData = async (group: FolderGroupData): Promise<boolean> => {
  const res = await clientFetch(`/api/groups/${group.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(group)
  })

  return res.ok
}

export const removeFolderGroupData = async (groupId: string): Promise<boolean> => {
  const res = await clientFetch(`/api/groups/${groupId}`, {
    method: 'DELETE',
  })

  return res.ok
}
