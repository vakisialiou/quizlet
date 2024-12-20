import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import {FoldersType} from "@store/initial-state";

export type SimulatorsInfo = {
  hasActive: boolean,
  countDone: number
}

export const getSimulatorsInfo = (simulators: ClientSimulatorData[]): SimulatorsInfo => {
  let countDone = 0
  let hasActive = false
  for (const {active, status} of simulators) {
    if (active) {
      hasActive = true
    }
    if (!active && status === SimulatorStatus.DONE) {
      countDone++
    }
  }
  return { countDone, hasActive }
}


type FindSimulator = {
  folderIndex: number;
  simulatorIndex: number,
  simulator: ClientSimulatorData | null
}

export const getSimulatorById = (folders: FoldersType, folderId: string, id: string): FindSimulator => {
  const folderIndex = folders.items.findIndex((folder) => folder.id === folderId)
  const { simulators } = folders.items[folderIndex]
  const simulatorIndex = simulators.findIndex((simulator) => simulator.id === id)
  return {
    folderIndex,
    simulatorIndex,
    simulator: simulators[simulatorIndex] || null
  }
}

export const findActiveSimulator = (folders: FoldersType, folderId: string): FindSimulator => {
  const folderIndex = folders.items.findIndex(({ id }) => id === folderId)
  const simulators = folders.items[folderIndex].simulators
  const simulatorIndex = simulators.findIndex(({ active }) => active)
  return {
    folderIndex,
    simulatorIndex,
    simulator: simulators[simulatorIndex] || null
  }
}

export const findNeedUpdateSimulators = (folders: FoldersType, folderId: string): ClientSimulatorData[] => {
  const folderIndex = folders.items.findIndex(({ id }) => id === folderId)
  return folders.items[folderIndex].simulators.filter(({ needUpdate }) => needUpdate)
}
