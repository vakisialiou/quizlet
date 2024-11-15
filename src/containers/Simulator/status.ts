import { SimulatorsType, SimulatorStatus } from '@store/initial-state'

export const getSimulatorStatus = (simulators: SimulatorsType, folderId: string): SimulatorStatus => {
  if (folderId in simulators) {
    return simulators[folderId].status || SimulatorStatus.WAITING
  }

  return SimulatorStatus.WAITING
}
