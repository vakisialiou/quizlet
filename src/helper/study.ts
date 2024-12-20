import { ClientFolderGroupData } from '@entities/ClientFolderGroup'
import { createFoldersRelation } from '@helper/folders-relation'
import { ClientSimulatorData } from '@entities/ClientSimulator'
import { sortSimulators } from '@helper/sort-simulators'
import { ClientFolderData} from '@entities/ClientFolder'
import { findModuleFolders } from '@helper/folders'

export type LastStudyChildFolder = {
  timestamp: number,
  folder: ClientFolderData | null,
  simulator: ClientSimulatorData | null,
  folderGroup: ClientFolderGroupData | null
}

export type LastStudyFolder = {
  timestamp: number
  child: LastStudyChildFolder,
  folder: ClientFolderData | null,
  simulator: ClientSimulatorData | null
}

export const getLastStudyFolder = (items: ClientFolderData[]): LastStudyFolder => {
  const last = {
    timestamp: 0,
    folder: null,
    simulator: null,
    child: {
      timestamp: 0,
      folder: null,
      simulator: null,
      folderGroup: null
    },
  } as LastStudyFolder

  const modules = findModuleFolders(items)

  for (const folder of modules) {
    if (folder.simulators.length === 0) {
      continue
    }

    const child = getLastStudyChildFolder(items, folder)
    const [ simulator ] = sortSimulators([...folder.simulators]).reverse()
    const simulatorTimestamp = new Date(simulator.createdAt).getTime()
    const actualTimestamp = child.timestamp > simulatorTimestamp ? child.timestamp : simulatorTimestamp

    if (!last.timestamp) {
      last.child = child
      last.folder = folder
      last.simulator = simulator
      last.timestamp = actualTimestamp
      continue
    }

    if (last.simulator) {
      if (actualTimestamp > last.timestamp) {
        last.child = child
        last.folder = folder
        last.simulator = simulator
        last.timestamp = actualTimestamp
      }
    }
  }
  return last
}

export const getLastStudyChildFolder = (items: ClientFolderData[], parentFolder: ClientFolderData | null): LastStudyChildFolder => {
  const last = {
    timestamp: 0,
    folder: null,
    simulator: null,
    folderGroup: null
  } as LastStudyChildFolder

  if (!parentFolder) {
    return last
  }

  const relations = createFoldersRelation(items)

  for (const folderGroup of [...parentFolder.folderGroups]) {
    for (const relationFolder of folderGroup.relationFolders) {
      const folder = relations[relationFolder.folderId]
      if (!folder || folder.simulators.length === 0) {
        continue
      }

      const [ simulator ] = sortSimulators([...folder.simulators]).reverse()

      if (!last.timestamp) {
        last.folder = folder
        last.simulator = simulator
        last.folderGroup = folderGroup
        last.timestamp = new Date(simulator.updatedAt).getTime()
      }

      if (last.simulator) {
        const timestamp = new Date(simulator.updatedAt).getTime()
        if (timestamp > last.timestamp) {
          last.folder = folder
          last.simulator = simulator
          last.timestamp = timestamp
          last.folderGroup = folderGroup
        }
      }
    }
  }

  return last
}
