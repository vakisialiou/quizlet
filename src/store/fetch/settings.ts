import { SettingsData } from '@entities/Settings'
import { clientFetch } from '@lib/fetch-client'

export const upsertSettings = async (settings: SettingsData): Promise<boolean> => {
  const res = await clientFetch(`/api/settings/simulator`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  })
  return res.ok
}
