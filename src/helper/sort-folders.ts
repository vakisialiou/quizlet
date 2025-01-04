import { FolderData } from '@entities/Folder'

export const sortFoldersDesc = (items: FolderData[]): FolderData[] => {
  return [...items].sort((a, b) => {
    if (a.order === b.order) {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
    return b.order - a.order
  })
}

export const sortFoldersAsc = (items: FolderData[]): FolderData[] => {
  return [...items].sort((a, b) => {
    if (a.order === b.order) {
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
    }
    return a.order - b.order
  })
}
