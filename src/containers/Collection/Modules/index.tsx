'use client'

import DialogRemoveModule from '@containers/DialogRemoveModule'
import DialogRemoveFolder from '@containers/DialogRemoveFolder'
import MetaLabel, {MetaLabelVariant} from '@components/MetaLabel'
import { findActiveSimulators } from '@helper/simulators/general'
import { useSimulatorSelect } from '@hooks/useSimulatorSelect'
import AchievementDegree from '@containers/AchievementDegree'
import {FolderFrameVariant} from '@components/FolderFrame'
import AchievementIcon from '@containers/AchievementIcon'
import { FolderGroupData } from '@entities/FolderGroup'
import {sortDesc, sortTop} from '@helper/sort-modules'
import { searchModules } from '@helper/search-modules'
import Folders from '@containers/Collection/Folders'
import { useTermSelect } from '@hooks/useTermSelect'
import DialogGroups from '@containers/DialogGroups'
import SVGEdit from '@public/svg/greasepencil.svg'
import { filterDeletedTerms } from '@helper/terms'
import Folder from '@containers/Collection/Folder'
import { getLastStudyModule } from '@helper/study'
import DialogShare from '@containers/DialogShare'
import SVGGroups from '@public/svg/syntax_on.svg'
import { actionUpdateModule } from '@store/index'
import React, { useMemo, useState } from 'react'
import SVGLinked from '@public/svg/linked.svg'
import { ModuleData } from '@entities/Module'
import { FolderData } from '@entities/Folder'
import SVGTrash from '@public/svg/trash.svg'
import { findTerms } from '@helper/relation'
import { useTranslations } from 'next-intl'
import SVGPlay from '@public/svg/play.svg'
import { useSelector } from 'react-redux'

enum DropDownIdEnums {
  GENERATE = 'GENERATE',
  EDIT_FOLDER = 'EDIT_FOLDER',
  OPEN_FOLDER = 'OPEN_FOLDER',
  REMOVE_FOLDER = 'REMOVE_FOLDER',
  SHARE = 'SHARE',
  STUDY = 'STUDY',
}

export type TypeFilter = {
  limit?: number,
  search?: string | null
}

export default function Modules(
  {
    editId,
    editable,
    filter = {},
    onOpenModule,
    onPlayModule,
    onPlayFolder,
  }:
  {
    editable: boolean
    editId: string | null
    filter: TypeFilter
    onOpenModule?: (module: ModuleData) => void
    onPlayModule?: (module: ModuleData) => void
    onPlayFolder?: (group: FolderGroupData, folder: FolderData) => void
  }
) {
  const { terms, relationTerms } = useTermSelect()
  const { simulators, relationSimulators } = useSimulatorSelect()

  const t = useTranslations('Modules')

  const dropdownParentItems = [
    {id: DropDownIdEnums.OPEN_FOLDER, name: t('dropDownEditModule'), icon: SVGEdit },
    {id: DropDownIdEnums.STUDY, name: t('dropDownStudyModule'), icon: SVGPlay },
    {id: DropDownIdEnums.GENERATE, name: t('dropDownGenerateGroups'), icon: SVGGroups },
    {id: DropDownIdEnums.SHARE, name: t('dropDownGenerateShare'), icon: SVGLinked },
    {id: '2', divider: true },
    {id: DropDownIdEnums.REMOVE_FOLDER, name: t('dropDownRemoveModule'), icon: SVGTrash },
  ]
  const modules = useSelector(({ modules }: { modules: ModuleData[] }) => modules)

  const [ removeFolder, setRemoveFolder ] = useState<{ group: FolderGroupData, folder: FolderData } | null>(null)
  const [ originModule, setOriginModule ] = useState<ModuleData | null>(null)
  const [ removeModule, setRemoveModule ] = useState<ModuleData | null>(null)
  const [ partition, setPartition ] = useState<ModuleData | null>(null)
  const [ share, setShare ] = useState<ModuleData | null>(null)


  const lastStudyModule = useMemo(() => {
    return getLastStudyModule(modules, relationSimulators, simulators)
  }, [modules, relationSimulators, simulators])

  const visibleModules = useMemo(() => {
    let rawModules = searchModules([...modules || []], filter.search || null, editId)
    return sortTop(sortDesc(rawModules), lastStudyModule?.id || null)
      .slice(0, filter.limit || Infinity)
  }, [modules, editId, filter, lastStudyModule])

  return (
    <>
      <div
        className="flex flex-col gap-2 text-start"
      >
        {visibleModules.length === 0 &&
          <div className="flex flex-col items-center justify-center gap-2 p-4">
            <div className="text-white/50 text-sm italic text-center">
              {t('noFoldersHelper', { btnName: t('footButtonCreateModule') })}
            </div>
          </div>
        }

        {visibleModules.map((module, index) => {
          const moduleTerms = findTerms(relationTerms, terms, { moduleId: module.id })
          const notRemovedTerms = filterDeletedTerms(moduleTerms)
          const activeSimulators = findActiveSimulators(relationSimulators, simulators, { moduleId: module.id })

          const isLastStudy = lastStudyModule?.id === module.id

          return (
            <Folder
              key={index}
              data={module}
              collapsed={module.collapsed}
              variant={isLastStudy ? FolderFrameVariant.blue : FolderFrameVariant.default}
              title={(
                <div className="flex gap-2 items-center font-bold">

                  <div className="flex items-center gap-1">
                    <AchievementIcon
                      degreeRate={module.degreeRate}
                      size={12}
                    />

                    <AchievementDegree
                      degreeRate={module.degreeRate}
                      className="text-xs font-bold uppercase text-white/50"
                    />
                  </div>
                </div>
              )}
              edit={editId === module.id}
              dropdown={{
                items: dropdownParentItems,
                onSelect: (id) => {
                  switch (id) {
                    case DropDownIdEnums.OPEN_FOLDER:
                      if (onOpenModule) {
                        onOpenModule(module)
                      }
                      break
                    case DropDownIdEnums.STUDY:
                      if (onPlayModule) {
                        onPlayModule(module)
                      }
                      break
                    case DropDownIdEnums.REMOVE_FOLDER:
                      setRemoveModule(module)
                      break
                    case DropDownIdEnums.GENERATE:
                      setPartition(module)
                      break
                    case DropDownIdEnums.SHARE:
                      setShare(module)
                      break
                  }
                }
              }}
              labels={(
                <>
                  {activeSimulators.length > 0 &&
                    <MetaLabel
                      variant={MetaLabelVariant.amber}
                    >
                      {t('folderLabelActive')}
                    </MetaLabel>
                  }

                  <MetaLabel>
                    {t('folderLabelTerms', { count: notRemovedTerms.length })}
                  </MetaLabel>
                </>
              )}
              onCollapse={() => {
                actionUpdateModule({
                  module: {...module, collapsed: !module.collapsed},
                  editId: null,
                  editable
                })
              }}
              onChange={(prop, value) => {
                actionUpdateModule({
                  module: { ...module, [prop]: value },
                  editId: module.id,
                  editable: false
                })
              }}
              onSave={() => {
                actionUpdateModule({ module, editId: null, editable }, () => {
                  setOriginModule(null)
                })
              }}
              onExit={() => {
                if (originModule) {
                  actionUpdateModule({
                    editable,
                    editId: null,
                    module: originModule
                  }, () => setOriginModule(null))
                }
              }}
            >
              {!module.collapsed &&
                <Folders
                  module={module}
                  onPlay={(group, folder) => {
                    if (onPlayFolder) {
                      onPlayFolder(group, folder)
                    }
                  }}
                  onRemove={(group, folder) => {
                    setRemoveFolder({ group, folder })
                  }}
                />
              }
            </Folder>
          )
        })}
      </div>

      {share &&
        <DialogShare
          module={share}
          onClose={() => {
            setShare(null)
          }}
        />
      }

      {partition &&
        <DialogGroups
          module={partition}
          onClose={() => {
            setPartition(null)
          }}
        />
      }

      {removeFolder &&
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

      {removeModule &&
        <DialogRemoveModule
          editable={editable}
          module={removeModule}
          onClose={() => {
            setRemoveModule(null)
          }}
          onDone={() => {
            setRemoveModule(null)
          }}
        />
      }
    </>
  )
}
