import { SimulatorData } from '@entities/Simulator'

export const sortSimulatorsDesc = (simulators: SimulatorData[]): SimulatorData[] => {
  return [...simulators].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
}
