import AchievementDegree from '@containers/AchievementDegree'
import AchievementIcon from '@containers/AchievementIcon'
import { FoldersType } from '@store/initial-state'
import { getFolderById } from '@helper/folders'
import { useTranslations } from 'next-intl'
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

  const { folder, moduleFolder } = useMemo(() => {
    const folder = getFolderById(folders.items, folderId)
    return {
      moduleFolder: folder?.parentId ? getFolderById(folders.items, folder.parentId) : folder,
      folder
    }
  }, [folders.items, folderId])

  const t = useTranslations('Folders')

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
            showDefault
            size={12}
          />
          <AchievementDegree
            folder={folder}
            className="text-white/50 text-xs font-bold"
          />
        </div>

        {(moduleFolder?.id !== folder?.id) &&
          <div className="text-white/50 text-xs font-bold">
            {folder?.name
              ? t('folderName', { num: folder?.name })
              : t('folderNoName')
            }
          </div>
        }
      </div>

      <div className="text-white/50 text-base font-bold truncate ...">
        {(moduleFolder?.id !== folder?.id)
          ? (moduleFolder?.name || t('folderNoName'))
          : folder?.name || t('folderNoName')
        }
      </div>
    </div>
  )
}
