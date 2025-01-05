import { SimulatorSettingsData } from '@entities/SimulatorSettings'
import { clientFetch } from '@lib/fetch-client'

export const upsertSettingsSimulator = async (settings: SimulatorSettingsData): Promise<boolean> => {
  const res = await clientFetch(`/api/settings/simulator`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  })
  return res.ok
}
