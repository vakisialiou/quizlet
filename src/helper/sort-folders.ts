import { ClientFolderData } from '@entities/ClientFolder'

export const sortFolders = (items: ClientFolderData[]): ClientFolderData[] => {
  return [...items].sort((a, b) => {
    if (a.order === b.order) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    return a.order - b.order
  })
}
