import { FolderGroupData } from '@entities/FolderGroup'

export const sortFolderGroups = (folderGroups: FolderGroupData[]) => {
  return [...folderGroups].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })
}
