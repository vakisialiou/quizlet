import { ClientFolderData } from '@entities/ClientFolder'

export const findModuleFolders = (items: ClientFolderData[]): ClientFolderData[] => {
  return [...items || []]
    .filter((item) => item.isModule)
}
