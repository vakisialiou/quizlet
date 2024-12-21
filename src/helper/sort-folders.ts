import { ClientFolderData } from '@entities/ClientFolder'

export const sortFolders = (items: ClientFolderData[]): ClientFolderData[] => {
  return [...items].sort((a, b) => {
    if (a.order === b.order) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    return b.order - a.order
  })
}
