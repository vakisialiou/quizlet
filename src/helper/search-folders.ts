import { ClientFolderData } from '@entities/ClientFolder'

export const searchFolders = (items: ClientFolderData[], search?: string | null, editItemId?: string | null): ClientFolderData[] => {
  if (!search) {
    return items
  }
  return items.filter(({ id, name }) => {
    if (editItemId === id) {
      return true
    }
    return `${name}`.toLocaleLowerCase().includes(search)
  })
}
