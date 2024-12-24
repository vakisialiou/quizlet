import { ClientFolderData } from '@entities/ClientFolder'

export const sortFoldersDesc = (items: ClientFolderData[]): ClientFolderData[] => {
  return [...items].sort((a, b) => {
    if (a.order === b.order) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    return b.order - a.order
  })
}

export const sortFoldersAsc = (items: ClientFolderData[]): ClientFolderData[] => {
  return [...items].sort((a, b) => {
    if (a.order === b.order) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    return a.order - b.order
  })
}
