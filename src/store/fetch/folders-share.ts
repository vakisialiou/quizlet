import { ClientFolderShareEnum } from '@entities/ClientFolderShare'
import { clientFetch } from '@lib/fetch-client'

export const upsertClientFolderShare = async (folderId: string, access: ClientFolderShareEnum): Promise<string> => {
  const res = await clientFetch(`/api/folders/share/${folderId}?access=${access}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    throw new Error('Something went wrong.', { cause: res.statusText })
  }

  const json = await res.json()
  return json.shareId
}
