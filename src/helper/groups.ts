import { FolderGroupData } from '@entities/FolderGroup'
import { TermData } from '@entities/Term'

export const GROUP_SIZE_5 = 5
export const GROUP_SIZE_10 = 10
export const GROUP_SIZE_15 = 15
export const DEFAULT_GROUP_SIZE = GROUP_SIZE_5

export const isGenerateGroupDisabled = (terms: TermData[], size: number) => {
  return terms.length < size
}

export const sortFolderGroups = (folderGroups: FolderGroupData[]) => {
  return [...folderGroups].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })
}
