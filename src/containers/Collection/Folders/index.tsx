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
import { getLastStudyFolder } from '@helper/study'
import { filterDeletedTerms } from '@helper/terms'
import SVGEdit from '@public/svg/greasepencil.svg'
import React, { useMemo, useState } from 'react'
import FolderCart from '@components/FolderCart'
import { FolderData } from '@entities/Folder'
import SVGTrash from '@public/svg/trash.svg'
import SVGPlay from '@public/svg/play.svg'
import {useTranslations} from 'next-intl'
import {useRouter} from '@i18n/routing'
import clsx from 'clsx'
import {sortFoldersAsc} from "@helper/sort-folders";

enum DropDownIdEnums {
  STUDY_FOLDER   = 'STUDY_FOLDER',
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
  const t = useTranslations('Folders')

  const folders = useFolderSelect()
  const { relationFolders } = useGroupSelect()
  const { terms, relationTerms } = useTermSelect()
  const { simulators, relationSimulators } = useSimulatorSelect()

  const lastStudyFolder = useMemo(() => {
    return getLastStudyFolder(folders, relationSimulators, simulators)
  }, [folders, relationSimulators, simulators])

  const [ removeFolder, setRemoveFolder ] = useState<{ group: FolderGroupData, folder: FolderData } | null>(null)

  const groupFolders = useMemo(() => {
    return sortFoldersAsc(findGroupFolders(relationFolders, folders, group.id))
  }, [relationFolders, folders, group.id])

  return (
    <div
      className="gap-2 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
    >
      {groupFolders.map((folder) => {
        const activeSimulators = findActiveSimulators(relationSimulators, simulators, {folderId: folder.id})
        const folderTerms = findTerms(relationTerms, terms, {folderId: folder.id})
        const notRemovedTerms = filterDeletedTerms(folderTerms)
        const isLastStudy = lastStudyFolder?.id === folder.id

        return (
          <FolderCart
            hover={true}
            key={folder.id}
            variant={isLastStudy ? FolderFrameVariant.yellow : FolderFrameVariant.default}
            dropdown={{
              items: [
                {
                  id: DropDownIdEnums.EDIT_FOLDER,
                  name: t('dropdownEdit'),
                  icon: SVGEdit,
                },
                {
                  id: DropDownIdEnums.STUDY_FOLDER,
                  name: t('dropdownStudy'),
                  icon: SVGPlay,
                },
                {id: 1, divider: true},
                {
                  id: DropDownIdEnums.REMOVE_FOLDER,
                  name: t('dropdownRemove'),
                  icon: SVGTrash
                },
              ],
              onSelect: (id) => {
                switch (id) {
                  case DropDownIdEnums.STUDY_FOLDER:
                    router.push(`/private/simulator/folder/${folder.id}`)
                    break
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
              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-1">
                  <AchievementIcon
                    degreeRate={folder.degreeRate}
                    size={12}
                  />

                  <AchievementDegree
                    degreeRate={folder.degreeRate}
                    className="text-xs font-bold uppercase text-white/50"
                  />
                </div>
              </div>
            )}
            labels={(
              <>
                {activeSimulators.length > 0 &&
                  <MetaLabel
                    variant={MetaLabelVariant.amber}
                  >
                    {t('labelActive')}
                  </MetaLabel>
                }

                <MetaLabel>
                  {notRemovedTerms.length}
                </MetaLabel>
              </>
            )}
            onClickBody={() => {
              router.push(`/private/simulator/folder/${folder.id}`)
            }}
          >
            <div
              className="flex flex-col px-1 justify-center h-full"
            >
              <div
                className={clsx('flex gap-2 items-center justify-between w-full', {
                  ['text-white/50']: true,
                })}
              >
                <div className="text-xs font-bold uppercase truncate ...">
                  {folder.name || t('folderNoName')}
                </div>

                <div className="flex gap-2 items-center text-base">
                  <SVGPlay
                    width={18}
                    height={18}
                  />
                  {t('btnPlay')}
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
