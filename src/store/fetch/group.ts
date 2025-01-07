import { RelationFolderData } from '@entities/RelationFolder'
import { RelationTermData } from '@entities/RelationTerm'
import { FolderGroupData } from '@entities/FolderGroup'
import { clientFetch } from '@lib/fetch-client'
import { FolderData } from '@entities/Folder'

export type TypeCreateGroupResponse = {
  folders: FolderData[],
  folderGroup: FolderGroupData,
  relationTerms: RelationTermData[],
  relationFolders: RelationFolderData[],
}

export const createGroup = async (moduleId: string, termIds: string[], size: number): Promise<TypeCreateGroupResponse> => {
  const res = await clientFetch(`/api/group/${moduleId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ termIds, size })
  })

  if (!res.ok) {
    throw new Error('Create partitions error.', { cause: res.statusText })
  }

  return await res.json()
}
