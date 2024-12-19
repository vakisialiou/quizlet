import { ClientFolderGroupData } from '@entities/ClientFolderGroup'
import { createFoldersRelation } from '@helper/folders-relation'
import { ClientSimulatorData } from '@entities/ClientSimulator'
import { sortSimulators } from '@helper/sort-simulators'
import { ClientFolderData} from '@entities/ClientFolder'


export type LastStudyFolder = {
  folder: ClientFolderData | null,
  simulator: ClientSimulatorData | null
}
export const getLastStudyFolder = (items: ClientFolderData[]): LastStudyFolder => {
  const last = {
    folder: null,
    simulator: null,
  } as LastStudyFolder

  for (const folder of items) {
    if (folder.simulators.length === 0) {
      continue
    }

    const [ simulator ] = sortSimulators([...folder.simulators]).reverse()

    if (!last.folder) {
      last.folder = folder
      last.simulator = simulator
      continue
    }
    if (last.simulator) {
      if (new Date(simulator.updatedAt).getTime() > new Date(last.simulator.updatedAt).getTime()) {
        last.folder = folder
        last.simulator = simulator
      }
    }
  }
  return last
}

export type LastStudyChildFolder = {
  folder: ClientFolderData | null,
  simulator: ClientSimulatorData | null,
  folderGroup: ClientFolderGroupData | null
}

export const getLastStudyChildFolder = (items: ClientFolderData[], parentFolder: ClientFolderData | null): LastStudyChildFolder => {
  const last = {
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

      if (!last.folder) {
        last.folder = folder
        last.simulator = simulator
        last.folderGroup = folderGroup
      }

      if (last.simulator) {
        if (new Date(simulator.updatedAt).getTime() > new Date(last.simulator.updatedAt).getTime()) {
          last.folder = folder
          last.simulator = simulator
          last.folderGroup = folderGroup
        }
      }
    }
  }

  return last
}
