import { clientFetch } from '@lib/fetch-client'
import { MultiFolders } from '@helper/folders'
import { FolderData } from '@entities/Folder'

export const upsertFolderData = async (folder: FolderData): Promise<boolean> => {
  const res = await clientFetch(`/api/folders/${folder.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(folder)
  })

  return res.ok
}

export const generateFoldersData = async (data: MultiFolders): Promise<boolean> => {
  const res = await clientFetch(`/api/folders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  return res.ok
}

export const deleteFolderData = async (folderId: string): Promise<boolean> => {
  const res = await clientFetch(`/api/folders/${folderId}`, {
    method: 'DELETE',
  })

  return res.ok
}
