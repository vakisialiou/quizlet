import { ClientSimulatorData } from '@entities/ClientSimulator'

export const sortSimulatorsDesc = (simulators: ClientSimulatorData[]): ClientSimulatorData[] => {
  return [...simulators].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
}
