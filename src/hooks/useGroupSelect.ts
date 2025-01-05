import { RelationFolderData } from '@entities/RelationFolder'
import { FolderGroupData } from '@entities/FolderGroup'
import { ConfigType } from '@store/initial-state'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'

type TypeGroupSelect = { folderGroups: FolderGroupData[], relationFolders: RelationFolderData[], }

export function useGroupSelect(): TypeGroupSelect {
  const folderGroups = useSelector((state: ConfigType) => state.folderGroups)
  const relationFolders = useSelector((state: ConfigType) => state.relationFolders)

  return useMemo(() => {
    return { folderGroups, relationFolders }
  }, [folderGroups, relationFolders])
}

