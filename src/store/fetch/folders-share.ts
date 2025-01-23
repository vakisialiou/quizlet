import { ModuleShareEnum, ModuleShareData } from '@entities/ModuleShare'
import { clientFetch } from '@lib/fetch-client'

export const upsertModuleShare = async (moduleId: string, access: ModuleShareEnum): Promise<ModuleShareData> => {
  const res = await clientFetch(`/api/modules/share/${moduleId}?access=${access}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    throw new Error('Something went wrong.', { cause: res.statusText })
  }

  const data = await res.json()
  return data.share
}
