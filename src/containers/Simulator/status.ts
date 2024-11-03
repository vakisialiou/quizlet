import { DataStateSimulatorsType, WAITING } from '@store/reducers/simulators'

export const getSimulatorStatus = (simulators: DataStateSimulatorsType, folderUUID: string) => {
  if (folderUUID in simulators) {
    return simulators[folderUUID].status
  }

  return WAITING
}
