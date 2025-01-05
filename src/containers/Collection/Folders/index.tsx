'use client'

import { findFolderGroups, findGroupFolders, findTerms } from '@helper/relation'
import { filterDeletedTerms, filterEmptyTerms } from '@helper/terms'
import MetaLabel, { MetaLabelVariant } from '@components/MetaLabel'
import { findActiveSimulators } from '@helper/simulators/general'
import { useSimulatorSelect } from '@hooks/useSimulatorSelect'
import AchievementDegree from '@containers/AchievementDegree'
import { FolderFrameVariant } from '@components/FolderFrame'
import AchievementIcon from '@containers/AchievementIcon'
import SVGAnchorRight from '@public/svg/anchor_right.svg'
import { useFolderSelect } from '@hooks/useFolderSelect'
import SVGAnchorLeft from '@public/svg/anchor_left.svg'
import { useGroupSelect } from '@hooks/useGroupSelect'
import { useTermSelect } from '@hooks/useTermSelect'
import Levels, {EnumLevels} from '@entities/Levels'
import { Fragment, useMemo, useState } from 'react'
import { getLastStudyFolder } from '@helper/study'
import { sortFolderGroups } from '@helper/groups'
import FolderCart from '@components/FolderCart'
import { FolderData } from '@entities/Folder'
import { ModuleData } from '@entities/Module'
import SVGTrash from '@public/svg/trash.svg'
import {useTranslations} from 'next-intl'
import SVGPlay from '@public/svg/play.svg'
import Clamp from '@components/Clamp'
import clsx from 'clsx'

enum DropDownIdEnums {
  REMOVE_FOLDER = 'REMOVE_FOLDER',
  STUDY = 'STUDY',
}

export default function Folders(
  {
    module,
    onPlay,
    onRemove,
  }:
  {
    module: ModuleData
    onPlay?: (folder: FolderData) => void
    onRemove?: (folder: FolderData) => void,
  }
) {
  const t = useTranslations('Folders')

  const { relationFolders, folderGroups } = useGroupSelect()
  const { simulators, relationSimulators } = useSimulatorSelect()
  const { terms, relationTerms } = useTermSelect()
  const folders = useFolderSelect()

  const moduleFolderGroups = useMemo(() => {
    return sortFolderGroups(findFolderGroups(folderGroups, module.id))
  }, [folderGroups])

  const [ flashcardBackSide, setFlashcardBackSide ] = useState(false)

  const playTerms = useMemo(() => {
    const moduleTerms = findTerms(relationTerms, terms, { moduleId: module.id })
    const filteredModuleTerms = filterDeletedTerms(filterEmptyTerms(moduleTerms))
    return filteredModuleTerms.map(({question, answer}) => flashcardBackSide ? answer : question).join(', ')
  }, [relationTerms, terms, flashcardBackSide])

  const lastStudyFolder = useMemo(() => {
    return getLastStudyFolder(folders, relationSimulators, simulators)
  }, [folders, relationSimulators, simulators])

  return (
    <div className="flex flex-col gap-2">
      {playTerms.length > 0 &&
        <Clamp
          rows={2}
          btnClumpMore={'Show more'}
          btnClumpLess={'Show less'}
          className="text-sm text-white/35 mx-[9px] mt-4"
          title={(
            <label
              className="flex justify-between font-bold text-white/50 w-full hover:opacity-80 active:opacity-70 transition-all cursor-pointer"
              onClick={() => {
                setFlashcardBackSide(!flashcardBackSide)
              }}
            >
              Flashcards:

              {flashcardBackSide &&
                <SVGAnchorLeft
                  width={20}
                  height={20}
                />
              }

              {!flashcardBackSide &&
                <SVGAnchorRight
                  width={20}
                  height={20}
                />
              }
            </label>
          )}
        >
          {playTerms}
        </Clamp>
      }

      {moduleFolderGroups.map((group, gIndex) => {
        const groupFolders = findGroupFolders(relationFolders, folders, group.id)
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

              {groupFolders.map((folder, index) => {
                const activeSimulators = findActiveSimulators(relationSimulators, simulators, { folderId: folder.id })
                const folderTerms = findTerms(relationTerms, terms, { folderId: folder.id })
                const notRemovedTerms = filterDeletedTerms(folderTerms)
                const isLastStudy = lastStudyFolder?.id === folder.id

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
                              onPlay(folder)
                            }
                            break
                          case DropDownIdEnums.REMOVE_FOLDER:
                            if (onRemove) {
                              onRemove(folder)
                            }
                            break
                        }
                      }
                    }}
                    title={(
                      <div className="flex gap-2 items-center font-bold">
                        <div className="flex items-center gap-1">
                          <AchievementIcon
                            degreeRate={folder.degreeRate}
                            size={12}
                          />

                          <AchievementDegree
                            degreeRate={folder.degreeRate}
                            className="text-sm font-bold uppercase text-white/50"
                          />
                        </div>
                      </div>
                    )}
                    labels={(
                      <>
                        {activeSimulators.length > 0 &&
                          <MetaLabel
                            disabled={disabled}
                            variant={MetaLabelVariant.amber}
                          >
                            {t('groupLabelActive')}
                          </MetaLabel>
                        }

                        <MetaLabel disabled={disabled}>
                          {t('groupLabelTerms', { count: notRemovedTerms.length })}
                        </MetaLabel>
                      </>
                    )}
                    onClickBody={() => {
                      if (onPlay) {
                        onPlay(folder)
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
                          {t('folderName', {num: folder.name})}
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
