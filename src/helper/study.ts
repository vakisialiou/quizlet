import { RelationSimulatorData } from '@entities/RelationSimulator'
import { sortSimulatorsDesc } from '@helper/sort-simulators'
import { SimulatorData } from '@entities/Simulator'
import { findSimulators } from '@helper/relation'
import { FolderData } from '@entities/Folder'
import { ModuleData } from '@entities/Module'

type LastStudyModule = {
  timestamp: number
  module: ModuleData | null,
  simulator: SimulatorData | null
}

export const getLastStudyModule = (modules: ModuleData[], relationSimulators: RelationSimulatorData[], simulators: SimulatorData[]): ModuleData | null => {
  const last = {
    timestamp: 0,
    module: null,
    simulator: null,
  } as LastStudyModule

  for (const course of modules) {
    const moduleSimulators = findSimulators(relationSimulators, simulators, { moduleId: course.id })
    const [ simulator ] = sortSimulatorsDesc(moduleSimulators)

    if (!simulator) {
      continue
    }

    if (!last.timestamp) {
      last.module = course
      last.simulator = simulator
      last.timestamp = new Date(simulator.createdAt).getTime()
      continue
    }

    const timestamp = new Date(simulator.createdAt).getTime()
    if (last.timestamp < timestamp) {
      last.module = course
      last.simulator = simulator
      last.timestamp = timestamp
    }
  }

  return last.module
}

type LastStudyFolder = {
  timestamp: number,
  folder: FolderData | null,
  simulator: SimulatorData | null,
}

export const getLastStudyFolder = (folders: FolderData[], relationSimulators: RelationSimulatorData[], simulators: SimulatorData[]): FolderData | null => {
  const last = {
    timestamp: 0,
    folder: null,
    simulator: null,
  } as LastStudyFolder

  for (const folder of folders) {
    const folderSimulators = findSimulators(relationSimulators, simulators, { folderId: folder.id })
    const [ simulator ] = sortSimulatorsDesc(folderSimulators)

    if (!simulator) {
      continue
    }

    if (!last.timestamp) {
      last.folder = folder
      last.simulator = simulator
      last.timestamp = new Date(simulator.createdAt).getTime()
      continue
    }

    const timestamp = new Date(simulator.createdAt).getTime()
    if (last.timestamp < timestamp) {
      last.folder = folder
      last.simulator = simulator
      last.timestamp = timestamp
    }
  }

  return last.folder
}
