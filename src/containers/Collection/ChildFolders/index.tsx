'use client'

import {
  DEFAULT_GROUP_SIZE,
  isGenerateGroupDisabled,
  minTermsCountToGenerateGroup
} from '@helper/groups'
import MetaLabel, { MetaLabelVariant } from '@components/MetaLabel'
import AchievementDegree from '@containers/AchievementDegree'
import AchievementIcon, { AchievementsSize } from '@containers/AchievementIcon'
import { FolderFrameVariant } from '@components/FolderFrame'
import { ClientFolderData } from '@entities/ClientFolder'
import { getSimulatorsInfo } from '@helper/simulators'
import { FoldersType } from '@store/initial-state'
import FolderCart from '@components/FolderCart'
import SVGTrash from '@public/svg/trash.svg'
import { useTranslations } from 'next-intl'
import SVGPlay from '@public/svg/play.svg'
import { useSelector } from 'react-redux'
import { Fragment, useMemo } from 'react'

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

  const dropdownChildrenItems = [
    {id: DropDownIdEnums.STUDY, name: t('dropDownEditGroup'), icon: SVGPlay },
    {id: '1', divider: true },
    {id: DropDownIdEnums.REMOVE_FOLDER, name: t('dropDownRemoveGroup'), icon: SVGTrash },
  ]

  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)

  const relatedItems = useMemo(() => {
    const res = {} as { [key: string]: ClientFolderData }

    const rawItems = [...folders.items || []]
    for (const item of rawItems) {
      if (!item.isModule) {
        res[item.id] = item
      }
    }

    return res
  }, [folders.items])

  const folderGroups = [...folder.folderGroups].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

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

              {group.relationFolders.map((relation, index) => {
                const childFolder = relatedItems[relation.folderId] as ClientFolderData
                if (!childFolder) {
                  return
                }

                const { hasActive } = getSimulatorsInfo(childFolder.simulators)
                const isLastStudy = lastFolderId === childFolder.id

                return (
                  <FolderCart
                    key={index}
                    hover={true}
                    variant={isLastStudy ? FolderFrameVariant.yellow : FolderFrameVariant.default}
                    dropdown={{
                      items: dropdownChildrenItems,
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
                            size={AchievementsSize.xs}
                          />

                          <AchievementDegree
                            hideDegree
                            folder={childFolder}
                            className="text-sm font-bold uppercase text-white/50"
                          />
                        </div>
                      </div>
                    )}
                    labels={(
                      <>
                        {hasActive &&
                          <MetaLabel
                            variant={MetaLabelVariant.amber}
                          >
                            {t('groupLabelActive')}
                          </MetaLabel>
                        }

                        <MetaLabel>
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
                      className="flex gap-2 items-center justify-between w-full p-2"
                    >
                      <div className="text-xs font-bold text-white/50 uppercase">
                        {t('folderName', {num: childFolder.name})}
                      </div>
                      <div className="flex gap-2 items-center text-base text-white/50">
                        <SVGPlay
                          width={18}
                          height={18}
                        />
                        {t('groupButtonStartStudy')}
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
