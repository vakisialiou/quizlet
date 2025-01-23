import AchievementDegree from '@containers/AchievementDegree'
import AchievementIcon from '@containers/AchievementIcon'
import { FolderData } from '@entities/Folder'
import { useTranslations } from 'next-intl'
import React from 'react'
import clsx from 'clsx'

export default function TitleFolder(
  {
    folder,
    className = '',
  }:
  {
    className?: string
    folder: FolderData | null,
  }
) {
  const t = useTranslations('Folder')

  return (
    <div
      className={clsx('flex items-center justify-between p-2 h-12 border-b border-white/10', {
        [className]: className,
      })}
    >
      <div className="text-white/50 text-base font-bold truncate ...">
        {folder?.name || t('folderNoName')}
      </div>

      <div
        className="flex gap-2 items-center uppercase"
      >
        <div className="flex gap-2 items-center">
          <AchievementDegree
            degreeRate={folder?.degreeRate || 0}
            className="text-white/50 text-xs font-bold"
          />
          <AchievementIcon
            degreeRate={folder?.degreeRate || 0}
            showDefault
            size={16}
          />
        </div>
      </div>
    </div>
  )
}
