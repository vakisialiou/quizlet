import { ClientSimulatorData } from '@entities/ClientSimulator'

export const sortSimulators = (simulators: ClientSimulatorData[]): ClientSimulatorData[] => {
  return [...simulators].sort((a, b) => {
    return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
  })
}
