import { RelationFolderData } from '@entities/RelationFolder'
import { FolderGroupData } from '@entities/FolderGroup'
import { FolderData } from '@entities/Folder'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'

type TypeGroupSelect = { folders: FolderData[], folderGroups: FolderGroupData[], relationFolders: RelationFolderData[], }

export function useGroupSelect(): TypeGroupSelect {
  const folders = useSelector((state: TypeGroupSelect) => state.folders)
  const folderGroups = useSelector((state: TypeGroupSelect) => state.folderGroups)
  const relationFolders = useSelector((state: TypeGroupSelect) => state.relationFolders)

  return useMemo(() => {
    return { folders, folderGroups, relationFolders }
  }, [folders, folderGroups, relationFolders])
}

