import { RelationSimulatorData } from '@entities/RelationSimulator'
import { findSimulators, RelationProps } from '@helper/relation'
import { SimulatorData } from '@entities/Simulator'
import { shuffle } from '@lib/array'

type UpdateCallback = (simulator: SimulatorData) => SimulatorData

export function getSimulatorById(simulators: SimulatorData[], simulatorId: string): SimulatorData | null {
  return simulators.find(({ id }) => id === simulatorId) || null
}

export function findActiveSimulators(relationSimulators: RelationSimulatorData[], simulators: SimulatorData[], relation: RelationProps): SimulatorData[] {
  return findSimulators(relationSimulators, simulators, relation)
    .filter(({ active }) => active)
}

export function updateSimulatorById(simulators: SimulatorData[], simulatorId: string, callback: UpdateCallback) {
  return simulators.map((item) => {
    if (item.id === simulatorId) {
      return { ...item, ...callback(item) }
    }
    return { ...item }
  })
}

export type SimulatorTermIdsFilter = {
  remember: boolean,
  continue: boolean,
  active: boolean
}

export const getAvailableTermIds = (simulator: SimulatorData, filter: SimulatorTermIdsFilter): string[] => {
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

    return true
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
