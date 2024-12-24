import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import { ClientFolderData } from '@entities/ClientFolder'
import { shuffle } from '@lib/array'

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

export const getSimulatorById = (items: ClientFolderData[], folderId: string, id: string): FindSimulator => {
  const folderIndex = items.findIndex((folder) => folder.id === folderId)
  const { simulators } = items[folderIndex]
  const simulatorIndex = simulators.findIndex((simulator) => simulator.id === id)
  return {
    folderIndex,
    simulatorIndex,
    simulator: simulators[simulatorIndex] || null
  }
}

export const findActiveSimulator = (items: ClientFolderData[], folderId: string): FindSimulator => {
  const folderIndex = items.findIndex(({ id }) => id === folderId)
  const simulators = items[folderIndex].simulators
  const simulatorIndex = simulators.findIndex(({ active }) => active)
  return {
    folderIndex,
    simulatorIndex,
    simulator: simulators[simulatorIndex] || null
  }
}

export const findNeedUpdateSimulators = (items: ClientFolderData[], folderId: string): ClientSimulatorData[] => {
  const folderIndex = items.findIndex(({ id }) => id === folderId)
  return items[folderIndex].simulators.filter(({ needUpdate }) => needUpdate)
}

export type SimulatorTermIdsFilter = {
  remember: boolean,
  continue: boolean,
  active: boolean
}

export const getAvailableTermIds = (simulator: ClientSimulatorData, filter: SimulatorTermIdsFilter): string[] => {
  let termIds = [...simulator.termIds]

  if (filter.active && simulator.termId) {
    termIds = termIds.filter((id) => id !== simulator.termId)
  }

  return termIds.filter((id) => {
      if (filter.remember && filter.continue) {
        return !simulator.rememberIds.includes(id) && !simulator.continueIds.includes(id)
      }
      if (filter.remember) {
        return !simulator.rememberIds.includes(id)
      }
      if (filter.continue) {
        return !simulator.continueIds.includes(id)
      }
    })
}

export const randomizeTermIds = (availableTermIds: string[]): string[] => {
  return shuffle(availableTermIds)
}

export const selectRandomTermId = (availableTermIds: string[]): string | null => {
  if (availableTermIds.length > 0) {
    const termIds = randomizeTermIds(availableTermIds)
    return termIds[0]
  }
  return null
}
