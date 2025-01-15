'use client'

import MetaLabel, { MetaLabelVariant } from '@components/MetaLabel'
import { findActiveSimulators } from '@helper/simulators/general'
import DialogRemoveFolder from '@containers/DialogRemoveFolder'
import { useSimulatorSelect } from '@hooks/useSimulatorSelect'
import { findGroupFolders, findTerms } from '@helper/relation'
import AchievementDegree from '@containers/AchievementDegree'
import { FolderFrameVariant } from '@components/FolderFrame'
import AchievementIcon from '@containers/AchievementIcon'
import { useFolderSelect } from '@hooks/useFolderSelect'
import { FolderGroupData } from '@entities/FolderGroup'
import { useGroupSelect } from '@hooks/useGroupSelect'
import { useTermSelect } from '@hooks/useTermSelect'
import Levels, {EnumLevels} from '@entities/Levels'
import { getLastStudyFolder } from '@helper/study'
import { filterDeletedTerms } from '@helper/terms'
import React, { useMemo, useState } from 'react'
import FolderCart from '@components/FolderCart'
import { FolderData } from '@entities/Folder'
import SVGTrash from '@public/svg/trash.svg'
import SVGPlay from '@public/svg/play.svg'
import {useTranslations} from 'next-intl'
import {useRouter} from '@i18n/routing'
import clsx from 'clsx'

enum DropDownIdEnums {
  REMOVE_FOLDER = 'REMOVE_FOLDER',
  EDIT_FOLDER   = 'EDIT_FOLDER',
}

export default function Folders(
  {
    group,
    editable,
  }:
    {
      group: FolderGroupData
      editable: boolean,
    }
) {
  const router = useRouter()
  const t = useTranslations('Modules')

  const folders = useFolderSelect()
  const { relationFolders } = useGroupSelect()
  const { terms, relationTerms } = useTermSelect()
  const { simulators, relationSimulators } = useSimulatorSelect()

  const lastStudyFolder = useMemo(() => {
    return getLastStudyFolder(folders, relationSimulators, simulators)
  }, [folders, relationSimulators, simulators])

  const [ removeFolder, setRemoveFolder ] = useState<{ group: FolderGroupData, folder: FolderData } | null>(null)

  const groupFolders = findGroupFolders(relationFolders, folders, group.id)
  let disabled = false
  return (
    <div
      className="gap-2 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
    >
      {groupFolders.map((folder, index) => {
        const activeSimulators = findActiveSimulators(relationSimulators, simulators, {folderId: folder.id})
        const folderTerms = findTerms(relationTerms, terms, {folderId: folder.id})
        const notRemovedTerms = filterDeletedTerms(folderTerms)
        const isLastStudy = lastStudyFolder?.id === folder.id

        const prevFolder = folders[index - 1]
        const prevDegreeRate = prevFolder?.degreeRate !== undefined ? prevFolder.degreeRate : 100
        disabled = disabled || !new Levels(prevDegreeRate, true).hasLevel(EnumLevels.expert)

        return (
          <FolderCart
            hover={true}
            key={folder.id}
            disabled={disabled}
            variant={isLastStudy ? FolderFrameVariant.yellow : FolderFrameVariant.default}
            dropdown={{
              items: [
                {
                  id: DropDownIdEnums.EDIT_FOLDER,
                  name: t('dropDownEdit'),
                  icon: SVGPlay,
                },
                {id: '1', divider: true},
                {
                  id: DropDownIdEnums.REMOVE_FOLDER,
                  name: t('dropDownRemove'),
                  icon: SVGTrash
                },
              ],
              onSelect: (id) => {
                switch (id) {
                  case DropDownIdEnums.EDIT_FOLDER:
                    router.push(`/private/groups/${group.id}/${folder.id}`)
                    break
                  case DropDownIdEnums.REMOVE_FOLDER:
                    setRemoveFolder({folder, group})
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
                  {t('groupLabelTerms', {count: notRemovedTerms.length})}
                </MetaLabel>
              </>
            )}
            onClickBody={() => {
              router.push(`/simulator?folderId=${folder.id}`)
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

      {removeFolder?.folder &&
        <DialogRemoveFolder
          editable={editable}
          group={removeFolder.group}
          folder={removeFolder.folder}
          onClose={() => {
            setRemoveFolder(null)
          }}
          onDone={() => {
            setRemoveFolder(null)
          }}
        />
      }
    </div>
  )
}
