import ClientSimulator, {ClientSimulatorData, SimulatorStatus} from '@entities/ClientSimulator'
import { getSimulatorById, findActiveSimulator } from '@helper/simulators'
import { FoldersType } from '@store/initial-state'
import { unique } from '@lib/array'

type UpdateSimulatorCallback = (simulator: ClientSimulatorData) => ClientSimulatorData

export const updateActiveSimulator = (folders: FoldersType, folderId: string, callback: UpdateSimulatorCallback): FoldersType => {
  const { simulatorIndex, folderIndex, simulator } = findActiveSimulator(folders, folderId)

  if (!simulator) {
    return folders
  }

  folders.items[folderIndex].simulators[simulatorIndex] = { ...callback(simulator) }

  return folders
}

export const updateSimulatorById = (folders: FoldersType, folderId: string, id: string, callback: UpdateSimulatorCallback): FoldersType => {
  const { folderIndex, simulatorIndex, simulator } = getSimulatorById(folders, folderId, id)
  if (!simulator) {
    return folders
  }

  folders.items[folderIndex].simulators[simulatorIndex] = { ...callback(simulator) }

  return folders
}

export const createActiveSimulator = (folders: FoldersType, folderId: string): FoldersType => {
  const prev = findActiveSimulator(folders, folderId)
  if (prev.folderIndex !== -1 && prev.simulator) {
    folders.items[prev.folderIndex].simulators[prev.simulatorIndex] = {
      ...prev.simulator,
      active: false
    }
  }

  const curr = new ClientSimulator(folderId, SimulatorStatus.WAITING).setActive(true).serialize()
  if (prev.folderIndex !== -1) {
    folders.items[prev.folderIndex].simulators.push(curr)
  }

  return folders
}

export const addHistoryId = (historyIds: string[], termId: string | null): string[] => {
  return termId ? [...historyIds, termId] : historyIds
}

export const addContinueId = (continueIds: string[], termId: string | null): string[] => {
  return termId ? unique([...continueIds, termId]) : continueIds
}

export const addRememberIds = (rememberIds: string[], termId: string | null): string[] => {
  return termId ? unique([...rememberIds, termId]) : rememberIds
}
