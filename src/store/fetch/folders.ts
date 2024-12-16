import { ClientFolderData } from '@entities/ClientFolder'
import { clientFetch } from '@lib/fetch-client'

export const getClientFolders = async (): Promise<ClientFolderData[]> => {
  return await clientFetch(`/api/folders`)
    .then((res) => res.json())
    .then((json) => json.items)
}

export const saveClientFolderData = async (folder: ClientFolderData) => {
  const res = await clientFetch(`/api/folders/${folder.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(folder)
  })

  if (!res.ok) {
    throw new Error('Put folder error.', { cause: res.statusText })
  }
}

export type DeleteClientFolderResults = {
  removeFolderIds: string[],
  removeFolderGroupIds: string,
  refreshFolder: ClientFolderData | null
}

export const deleteClientFolderData = async (folderId: string): Promise<DeleteClientFolderResults> => {
  const res = await clientFetch(`/api/folders/${folderId}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error('Delete folder error.', { cause: res.statusText })
  }

  return await res.json() as DeleteClientFolderResults
}
