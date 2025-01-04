import { ModuleData } from '@entities/Module'
import { clientFetch } from '@lib/fetch-client'

export const saveModuleData = async (module: ModuleData): Promise<boolean> => {
  const res = await clientFetch(`/api/modules/${module.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(module)
  })

  return res.ok
}

export const updateModuleData = async (module: ModuleData): Promise<boolean> => {
  const res = await clientFetch(`/api/modules/${module.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(module)
  })

  return res.ok
}

export const deleteModuleData = async (moduleId: string): Promise<boolean> => {
  const res = await clientFetch(`/api/modules/${moduleId}`, {
    method: 'DELETE',
  })

  return res.ok
}
