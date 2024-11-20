import ClientSimulator, {ClientSimulatorData, SimulatorStatus} from '@entities/ClientSimulator'
import { ClientFolderData } from '@entities/ClientFolder'
import { ClientTermData } from '@entities/ClientTerm'
import { FoldersType } from '@store/initial-state'
import {unique} from "@lib/array";

export const filterFolderTerms = (folder: ClientFolderData | undefined | null): ClientTermData[] => {
  return [...folder?.terms || []].filter(({ answer, question }) => {
    return answer && question
  })
}

export const findNeedUpdateSimulators = (folders: FoldersType, folderId: string): ClientSimulatorData[] => {
  const folderIndex = folders.items.findIndex(({ id }) => id === folderId)
  return folders.items[folderIndex].simulators.filter(({ needUpdate }) => needUpdate)
}

type FindSimulator = {
  folderIndex: number;
  simulatorIndex: number,
  simulator: ClientSimulatorData | null
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

type UpdateSimulatorCallback = (simulator: ClientSimulatorData) => ClientSimulatorData
export const updateActiveSimulator = (folders: FoldersType, folderId: string, callback: UpdateSimulatorCallback): FoldersType => {
  const { simulatorIndex, folderIndex, simulator } = findActiveSimulator(folders, folderId)

  if (!simulator) {
    return folders
  }

  folders.items[folderIndex].simulators[simulatorIndex] = { ...callback(simulator) }

  return folders
}

export const findSimulatorById = (folders: FoldersType, folderId: string, id: string): FindSimulator => {
  const folderIndex = folders.items.findIndex((folder) => folder.id === folderId)
  const { simulators } = folders.items[folderIndex]
  const simulatorIndex = simulators.findIndex((simulator) => simulator.id === id)
  return {
    folderIndex,
    simulatorIndex,
    simulator: simulators[simulatorIndex] || null
  }
}

export const updateSimulatorById = (folders: FoldersType, folderId: string, id: string, callback: UpdateSimulatorCallback): FoldersType => {
  const { folderIndex, simulatorIndex, simulator } = findSimulatorById(folders, folderId, id)
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
