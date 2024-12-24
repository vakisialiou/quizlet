import { ClientFolderGroupData } from '@entities/ClientFolderGroup'
import { ClientFolderData } from '@entities/ClientFolder'
import { getFolderById } from '@helper/folders'

export type FoldersRelation = { [key: string]: ClientFolderData }

export const createRelationFoldersMap = (items: ClientFolderData[]): FoldersRelation => {
  const res = {} as FoldersRelation

  const rawItems = [...items || []]
  for (const item of rawItems) {
    res[item.id] = item
  }

  return res
}

export type GroupsRelation = { [key: string]: ClientFolderData[] }

export const createRelationGroups = (folderGroups: ClientFolderGroupData[], items: ClientFolderData[]): GroupsRelation => {
  const res = {} as GroupsRelation
  for (const group of folderGroups) {
    if (!(group.id in res)) {
      res[group.id] = []
    }

    for (const relation of group.relationFolders) {
      const folder = getFolderById(items, relation.folderId)
      if (!folder) {
        continue
      }

      res[group.id].push(folder)
    }
  }
  return res
}
