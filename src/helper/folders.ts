import { filterDeletedTerms, filterEmptyTerms } from '@helper/terms'
import { ClientFolderData } from '@entities/ClientFolder'

export const getFolderById = (folderItems: ClientFolderData[], folderId: string): ClientFolderData | null => {
  return [...folderItems].find(({ id }) => id === folderId) || null
}

export const findModuleFolders = (items: ClientFolderData[]): ClientFolderData[] => {
  return [...items || []]
    .filter((item) => item.isModule)
}

export const findParentFolder = (folderItems: ClientFolderData[], folder: ClientFolderData): ClientFolderData | null => {
  return folderItems.find(({ id }) => id === folder.parentId) || null
}

export const ensureActualFolderTermsByFolderId = (items: ClientFolderData[], folderId: string): ClientFolderData | null => {
  const folderItems = [...items || []]
  const folder = getFolderById(folderItems, folderId)
  if (folder) {
    return ensureFolderValidTerms(folderItems, folder)
  }
  return null
}

function ensureFolderValidTerms(folderItems: ClientFolderData[], folder: ClientFolderData): ClientFolderData {
  if (folder.parentId) {
    const parentFolder = findParentFolder(folderItems, folder)
    if (parentFolder) {
      // У дочерних элементов нет собственных терминов. Но они имеют связь с терминами родителя.
      const relationTermIds = [...folder.relationTerms].map(({ termId }) => termId)
      return {
        ...folder,
        // Отфильтровать термины у которых незаполненны поля.
        // Здесь ненужно применять фильтр удаленных терминов.
        terms: filterEmptyTerms([...parentFolder?.terms || []]).filter((term) => {
          return relationTermIds.includes(term.id)
        })
      } as ClientFolderData
    }
  }

  return {
    ...folder,
    // Отфильтровать термины у которых незаполненны поля.
    // Отфильтровать термины которые удалены.
    terms: filterDeletedTerms(filterEmptyTerms([...folder?.terms || []]))
  } as ClientFolderData
}

