import { ClientSettingsSimulatorData } from '@entities/ClientSettingsSimulator'
import { clientFetch } from '@lib/fetch-client'

export const upsertSettingsSimulator = async (settings: ClientSettingsSimulatorData): Promise<boolean> => {
  const res = await clientFetch(`/api/settings/simulator`, {
    method: 'PUT',
    body: JSON.stringify(settings)
  })
  return res.ok
}
