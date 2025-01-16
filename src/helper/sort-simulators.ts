import { SimulatorData } from '@entities/Simulator'

export const sortSimulatorsDesc = (simulators: SimulatorData[]): SimulatorData[] => {
  return [...simulators].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}
