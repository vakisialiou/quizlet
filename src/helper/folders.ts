import { ClientFolderData } from '@entities/ClientFolder'

export const findTopFolder = (folderItems: ClientFolderData[], folderId: string) => {
  const folder = getFolderById(folderItems, folderId)
  return folder?.parentId ? getFolderById(folderItems, folder.parentId) : folder
}

export const getFolderById = (folderItems: ClientFolderData[], folderId: string): ClientFolderData | null => {
  return [...folderItems].find(({ id }) => id === folderId) || null
}

export const findModuleFolders = (items: ClientFolderData[]): ClientFolderData[] => {
  return [...items || []]
    .filter((item) => item.isModule)
}

export const ensureFolderTerms = (items: ClientFolderData[], folder: ClientFolderData | null): ClientFolderData | null => {
  if (folder?.parentId) {
    const parentFolder = getFolderById(items, folder.parentId)
    return { ...folder, terms: [ ...parentFolder?.terms || [] ] }
  }
  return folder
}
