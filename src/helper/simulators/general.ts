import RelationSimulator, { RelationSimulatorData } from '@entities/RelationSimulator'
import Simulator, { SimulatorData, SimulatorStatus } from '@entities/Simulator'
import { findSimulators, RelationProps } from '@helper/relation'

type UpdateCallback = (simulator: SimulatorData) => SimulatorData

export function findActiveSimulators(relationSimulators: RelationSimulatorData[], simulators: SimulatorData[], relation: RelationProps): SimulatorData[] {
  return findSimulators(relationSimulators, simulators, relation)
    .filter(({ active }) => active)
}

export function updateActiveSimulator(relationSimulators: RelationSimulatorData[], simulators: SimulatorData[], relation: RelationProps, callback: UpdateCallback): SimulatorData[] {
  const activeSimulators = findActiveSimulators(relationSimulators, simulators, relation)

  for (let simulator of activeSimulators) {
    simulators = updateSimulatorById(simulators, simulator.id, callback)
  }

  return simulators
}

export function updateSimulatorById(simulators: SimulatorData[], simulatorId: string, callback: UpdateCallback) {
  return simulators.map((item) => {
    if (item.id === simulatorId) {
      return { ...item, ...callback(item) }
    }
    return { ...item }
  })
}

export const createSimulator = (relation: RelationProps): { simulator: Simulator, relationSimulator: RelationSimulator } => {
  const simulator = new Simulator(SimulatorStatus.WAITING)
  // TODO
  // termId: termIds[0] || null,
  // settings: { ...settings },
  // termIds: randomizeTermIds(termIds),
  // status: SimulatorStatus.PROCESSING

  const relationSimulator = new RelationSimulator()
    .setSimulatorId(simulator.id)
    .setFolderId(relation.folderId || null)
    .setModuleId(relation.moduleId || null)

  return { simulator, relationSimulator }
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
  })
}
