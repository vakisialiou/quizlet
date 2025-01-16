import { FolderData } from '@entities/Folder'

export const sortFoldersDesc = (items: FolderData[]): FolderData[] => {
  return [...items].sort((a, b) => {
    if (a.order === b.order) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    return b.order - a.order
  })
}

export const sortFoldersAsc = (items: FolderData[]): FolderData[] => {
  return [...items].sort((a, b) => {
    if (a.order === b.order) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    return a.order - b.order
  })
}
