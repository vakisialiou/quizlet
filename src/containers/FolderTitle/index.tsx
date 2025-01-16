import {getModule, RelationProps, getFolder, getModuleByFolderId} from '@helper/relation'
import AchievementDegree from '@containers/AchievementDegree'
import { RelationFolderData } from '@entities/RelationFolder'
import AchievementIcon from '@containers/AchievementIcon'
import { FolderGroupData } from '@entities/FolderGroup'
import { FolderData } from '@entities/Folder'
import { ModuleData } from '@entities/Module'
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux'
import React, { useMemo } from 'react'
import clsx from 'clsx'

export default function FolderTitle(
  {
    relation,
    className = '',
  }:
  {
    className?: string
    relation: RelationProps,
  }
) {
  const folders = useSelector(({ folders }: { folders: FolderData[] }) => folders)
  const modules = useSelector(({ modules }: { modules: ModuleData[] }) => modules)
  const folderGroups = useSelector(({ folderGroups }: { folderGroups: FolderGroupData[] }) => folderGroups)
  const relationFolders = useSelector(({ relationFolders }: { relationFolders: RelationFolderData[] }) => relationFolders)

  const { folder, module } = useMemo(() => {
    if (relation.folderId) {
      return {
        module: null,
        folder: getFolder(folders, relation.folderId),
      }
    }
    if (relation.moduleId) {
      return {
        module: getModule(modules, relation.moduleId),
        folder: null,
      }
    }

    return { module: null, folder: null }
  }, [folderGroups, relationFolders, modules, folders, relation])

  const t = useTranslations('Module')

  return (
    <div
      className={clsx('flex items-center justify-between p-2 h-12 border-b border-white/10', {
        [className]: className,
      })}
    >
      <div className="text-white/50 text-base font-bold truncate ...">
        {folder?.name || module?.name || t('moduleNoName')}
      </div>

      <div
        className="flex gap-2 items-center uppercase"
      >
        <div className="flex gap-2 items-center">
          <AchievementDegree
            degreeRate={module?.degreeRate || folder?.degreeRate || 0}
            className="text-white/50 text-xs font-bold"
          />
          <AchievementIcon
            degreeRate={module?.degreeRate || folder?.degreeRate || 0}
            showDefault
            size={16}
          />
        </div>

      </div>
    </div>
  )
}
