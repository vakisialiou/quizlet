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
        module: getModuleByFolderId(folderGroups, relationFolders, modules, relation.folderId),
        folder: getFolder(folders, relation.folderId),
      }
    }
    return {
      module: relation.moduleId ? getModule(modules, relation.moduleId) : null,
      folder: null,
    }
  }, [folderGroups, relationFolders, modules, folders, relation])

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
            degreeRate={module ? module.degreeRate : (folder?.degreeRate || 0)}
            showDefault
            size={12}
          />
          <AchievementDegree
            degreeRate={module ? module.degreeRate : (folder?.degreeRate || 0)}
            className="text-white/50 text-xs font-bold"
          />
        </div>

        {(module && folder) &&
          <div className="text-white/50 text-xs font-bold">
            {folder?.name
              ? t('folderName', { num: folder?.name })
              : t('folderNoName')
            }
          </div>
        }
      </div>

      <div className="text-white/50 text-base font-bold truncate ...">
        {module?.name || t('folderNoName')}
      </div>
    </div>
  )
}
