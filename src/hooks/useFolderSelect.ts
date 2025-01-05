import { ConfigType } from '@store/initial-state'
import { FolderData } from '@entities/Folder'
import { useSelector } from 'react-redux'

export function useFolderSelect(): FolderData[] {
  return useSelector((state: ConfigType) => state.folders)
}

