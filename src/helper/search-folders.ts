import { FolderData } from '@entities/Folder'

export const searchFolders = (items: FolderData[], search?: string | null, editItemId?: string | null): FolderData[] => {
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
