import { ClientFolderData } from '@entities/ClientFolder'

export type FoldersRelation = { [key: string]: ClientFolderData }

export const createFoldersRelation = (items: ClientFolderData[]): FoldersRelation => {
  const res = {} as FoldersRelation

  const rawItems = [...items || []]
  for (const item of rawItems) {
    res[item.id] = item
  }

  return res
}
