import { FolderGroupData } from '@entities/FolderGroup'
import { FolderData } from '@entities/Folder'
import { getFolderById } from '@helper/folders'

export type FoldersRelation = { [key: string]: FolderData }

export const createRelationFoldersMap = (items: FolderData[]): FoldersRelation => {
  const res = {} as FoldersRelation

  const rawItems = [...items || []]
  for (const item of rawItems) {
    res[item.id] = item
  }

  return res
}

export type GroupsRelation = { [key: string]: FolderData[] }

export const createRelationGroups = (folderGroups: FolderGroupData[], items: FolderData[]): GroupsRelation => {
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
