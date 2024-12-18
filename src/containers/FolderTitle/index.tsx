import AchievementIcon, {AchievementsSize} from '@containers/AchievementIcon'
import { getActualFolderData } from '@containers/Simulator/helpers'
import AchievementDegree from '@containers/AchievementDegree'
import { FoldersType } from '@store/initial-state'
import { useSelector } from 'react-redux'
import React, { useMemo } from 'react'

export default function FolderTitle({ folderId }: { folderId: string }) {
  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)

  const { folder, parentFolder } = useMemo(() => {
    const folder = getActualFolderData(folders.items, folderId)
    return {
      folder,
      parentFolder: (folder && folder.parentId)
        ? getActualFolderData(folders.items, folder.parentId)
        : null,
    }
  }, [folders.items, folderId])

  return (
    <div className="flex flex-col px-4 py-2 border-b border-white/10">
      <div className="text-gray-500 text-base font-bold truncate ...">
        {parentFolder ? (parentFolder.name || '(No name)') : folder?.name || '(No name)'}
      </div>

      <div
        className="flex gap-2 items-center uppercase"
      >
        <div className="flex items-center">
          <AchievementIcon
            folder={folder}
            size={AchievementsSize.sm}
          />
          <AchievementDegree
            hideDegree
            folder={folder}
            className="text-gray-500 text-xs ml-4 font-bold"
          />
        </div>

        {parentFolder &&
          <div className="text-gray-500 text-xs font-bold">
            {`Group ${folder?.name}` || '(No name)'}
          </div>
        }
      </div>
    </div>
  )
}
