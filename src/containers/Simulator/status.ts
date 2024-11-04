import { DataStateSimulatorsType } from '@store/reducers/simulators'

export enum SimulatorStatus {
  PROCESSING = 'processing',
  FINISHING = 'finishing',
  WAITING = 'waiting'
}

export const getSimulatorStatus = (simulators: DataStateSimulatorsType, folderUUID: string): SimulatorStatus => {
  if (folderUUID in simulators) {
    return simulators[folderUUID].status || SimulatorStatus.WAITING
  }

  return SimulatorStatus.WAITING
}
