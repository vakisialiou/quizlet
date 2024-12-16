import { clientFetch } from '@lib/fetch-client'

export const createPartitions = async (folderId: string, partitionSize: number) => {
  const res = await clientFetch(`/api/partitions/${folderId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ partitionSize })
  })

  if (!res.ok) {
    throw new Error('Create partitions error.', { cause: res.statusText })
  }

  return await res.json()
}
