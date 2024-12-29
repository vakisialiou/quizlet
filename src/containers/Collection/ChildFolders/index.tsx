'use client'

import {
  DEFAULT_GROUP_SIZE,
  isGenerateGroupDisabled,
  minTermsCountToGenerateGroup,
  sortFolderGroups
} from '@helper/groups'
import MetaLabel, {MetaLabelVariant} from '@components/MetaLabel'
import {createRelationGroups} from '@helper/folders-relation'
import AchievementDegree from '@containers/AchievementDegree'
import AchievementIcon from '@containers/AchievementIcon'
import {FolderFrameVariant} from '@components/FolderFrame'
import {ClientFolderData} from '@entities/ClientFolder'
import {getSimulatorsInfo} from '@helper/simulators'
import {sortFoldersAsc} from '@helper/sort-folders'
import {FoldersType} from '@store/initial-state'
import FolderCart from '@components/FolderCart'
import SVGTrash from '@public/svg/trash.svg'
import {useTranslations} from 'next-intl'
import SVGPlay from '@public/svg/play.svg'
import {useSelector} from 'react-redux'
import {Fragment, useMemo} from 'react'
import clsx from 'clsx'
import Levels, {EnumLevels} from '@entities/Levels'

enum DropDownIdEnums {
  REMOVE_FOLDER = 'REMOVE_FOLDER',
  STUDY = 'STUDY',
}

export default function ChildFolders(
  {
    folder,
    lastFolderId,
    onPlay,
    onRemove,
  }:
  {
    folder: ClientFolderData
    lastFolderId?: string | null,
    onPlay?: (folder: ClientFolderData) => void
    onRemove?: (folder: ClientFolderData) => void,
  }
) {
  const t = useTranslations('Folders')

  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)

  const folderGroups = useMemo(() => {
    return sortFolderGroups(folder.folderGroups)
  }, [folder.folderGroups])

  const relatedGroups = useMemo(() => {
    const relations = createRelationGroups(folder.folderGroups, folders.items)
    for (const prop in relations) {
      relations[prop] = sortFoldersAsc(relations[prop])
    }
    return relations
  }, [folders.items, folder.folderGroups])

  return (
    <div className="flex flex-col gap-2">
      {isGenerateGroupDisabled(folder, DEFAULT_GROUP_SIZE) &&
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-white/50 text-sm italic text-center">
            {t('warnGridGroup1', { size: minTermsCountToGenerateGroup(DEFAULT_GROUP_SIZE) })}
          </div>
        </div>
      }

      {folderGroups.map((group, gIndex) => {
        const folders = relatedGroups[group.id] || []
        let disabled = false
        return (
          <Fragment
            key={gIndex}
          >
            <div className="flex items-center justify-between w-full p-2">
              <span className="text-white/55 font-bold text-xs">
                {group.name}
              </span>
            </div>
            <div
              className="gap-2 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">

              {folders.map((childFolder, index) => {
                const simulatorsInfo = getSimulatorsInfo(childFolder.simulators)
                const isLastStudy = lastFolderId === childFolder.id

                const prevFolder = folders[index - 1]
                const prevDegreeRate = prevFolder?.degreeRate !== undefined ? prevFolder.degreeRate : 100
                disabled = disabled || !new Levels(prevDegreeRate, true).hasLevel(EnumLevels.expert)

                return (
                  <FolderCart
                    key={index}
                    hover={true}
                    disabled={disabled}
                    variant={isLastStudy ? FolderFrameVariant.yellow : FolderFrameVariant.default}
                    dropdown={{
                      items: [
                        {id: DropDownIdEnums.STUDY, name: t('dropDownEditGroup'), icon: SVGPlay, disabled },
                        {id: '1', divider: true },
                        {id: DropDownIdEnums.REMOVE_FOLDER, name: t('dropDownRemoveGroup'), icon: SVGTrash },
                      ],
                      onSelect: (id) => {
                        switch (id) {
                          case DropDownIdEnums.STUDY:
                            if (onPlay) {
                              onPlay(childFolder)
                            }
                            break
                          case DropDownIdEnums.REMOVE_FOLDER:
                            if (onRemove) {
                              onRemove(childFolder)
                            }
                            break
                        }
                      }
                    }}
                    title={(
                      <div className="flex gap-2 items-center font-bold">
                        <div className="flex items-center gap-1">
                          <AchievementIcon
                            folder={childFolder}
                            size={12}
                          />

                          <AchievementDegree
                            folder={childFolder}
                            className="text-sm font-bold uppercase text-white/50"
                          />
                        </div>
                      </div>
                    )}
                    labels={(
                      <>
                        {simulatorsInfo.hasActive &&
                          <MetaLabel
                            disabled={disabled}
                            variant={MetaLabelVariant.amber}
                          >
                            {t('groupLabelActive')}
                          </MetaLabel>
                        }

                        <MetaLabel disabled={disabled}>
                          {t('groupLabelTerms', { count: childFolder.relationTerms.length })}
                        </MetaLabel>
                      </>
                    )}
                    onClickBody={() => {
                      if (onPlay) {
                        onPlay(childFolder)
                      }
                    }}
                  >
                    <div
                      className="flex flex-col px-1 justify-center h-full"
                    >
                      <div
                        className={clsx('flex gap-2 items-center justify-between w-full', {
                          ['text-white/50']: !disabled,
                          ['text-white/15']: disabled
                        })}
                      >
                        <div className="text-xs font-bold uppercase">
                          {t('folderName', {num: childFolder.name})}
                        </div>
                        <div className="flex gap-2 items-center text-base">
                          <SVGPlay
                            width={18}
                            height={18}
                          />
                          {t('groupButtonStartStudy')}
                        </div>
                      </div>
                    </div>
                  </FolderCart>
                )
              })}
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}
