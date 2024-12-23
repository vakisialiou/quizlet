import AchievementIcon, {AchievementsSize} from '@containers/AchievementIcon'
import AchievementDegree from '@containers/AchievementDegree'
import { FoldersType } from '@store/initial-state'
import { getFolderById } from '@helper/folders'
import { useSelector } from 'react-redux'
import React, { useMemo } from 'react'
import clsx from 'clsx'

export default function FolderTitle(
  {
    folderId,
    className = '',
  }:
  {
    folderId: string,
    className?: string
  }
) {
  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)

  const { folder, parentFolder } = useMemo(() => {
    const folder = getFolderById(folders.items, folderId)
    return {
      parentFolder: folder?.parentId ? getFolderById(folders.items, folder?.parentId) : folder,
      folder: !folder?.parentId ? folder : null
    }
  }, [folders.items, folderId])

  return (
    <div
      className={clsx('flex flex-col px-2 md:px-0 pb-3 border-b border-white/10', {
        [className]: className,
      })}
    >
      <div
        className="flex gap-2 items-center uppercase"
      >
        <div className="flex gap-2 items-center">
          <AchievementIcon
            folder={folder}
            size={AchievementsSize.sm}
          />
          <AchievementDegree
            hideDegree
            folder={folder}
            className="text-white/50 text-xs font-bold"
          />
        </div>

        {parentFolder &&
          <div className="text-white/50 text-xs font-bold">
            {`Group ${folder?.name}` || '(No name)'}
          </div>
        }
      </div>

      <div className="text-white/50 text-base font-bold truncate ...">
        {parentFolder ? (parentFolder.name || '(No name)') : folder?.name || '(No name)'}
      </div>
    </div>
  )
}
