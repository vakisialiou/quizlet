import { UpsertSimulatorsIds } from '@store/reducers/simulators'
import { ClientSimulatorData } from '@entities/ClientSimulator'
import { clientFetch } from '@lib/fetch-client'

export const upsertSimulator = async (simulator: ClientSimulatorData): Promise<UpsertSimulatorsIds> => {
  return upsertSimulators([simulator])
}

export const upsertSimulators = async (simulators: ClientSimulatorData[]): Promise<UpsertSimulatorsIds> => {
  const promises = simulators.map(async (simulator) => {
    const res = await clientFetch(`/api/simulators/${simulator.id}`, {
      method: 'PUT',
      body: JSON.stringify(simulator)
    })
    return res.ok ? simulator.id : null
  })
  return (await Promise.all(promises)).filter((id) => id)
}
