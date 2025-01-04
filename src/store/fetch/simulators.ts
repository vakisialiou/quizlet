import { RelationSimulatorData } from '@entities/RelationSimulator'
import { SimulatorData } from '@entities/Simulator'
import { clientFetch } from '@lib/fetch-client'

export const saveSimulator = async (relationSimulator: RelationSimulatorData, simulator: SimulatorData): Promise<boolean> => {
  const res = await clientFetch(`/api/simulators/${simulator.id}`, {
    method: 'PUT',
    body: JSON.stringify({ relationSimulator, simulator })
  })
  return res.ok
}

export const upsertSimulator = async (simulator: SimulatorData): Promise<boolean> => {
  const res = await clientFetch(`/api/simulators/${simulator.id}`, {
    method: 'POST',
    body: JSON.stringify({ simulator })
  })
  return res.ok
}
