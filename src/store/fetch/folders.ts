import { clientFetch } from '@lib/fetch-client'
import { FolderData } from '@entities/Folder'

export const saveFolderData = async (folder: FolderData): Promise<boolean> => {
  const res = await clientFetch(`/api/folders/${folder.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(folder)
  })

  return res.ok
}

export const updateFolderData = async (folder: FolderData): Promise<boolean> => {
  const res = await clientFetch(`/api/folders/${folder.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(folder)
  })

  return res.ok
}

export const deleteFolderData = async (folderId: string): Promise<boolean> => {
  const res = await clientFetch(`/api/folders/${folderId}`, {
    method: 'DELETE',
  })

  return res.ok
}
