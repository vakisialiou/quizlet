'use client'

import {actionUpdateFolderGroup, actionUpdateModule} from '@store/index'
import MetaLabel, {MetaLabelVariant} from '@components/MetaLabel'
import { findActiveSimulators } from '@helper/simulators/general'
import DialogRemoveModule from '@containers/DialogRemoveModule'
import { useSimulatorSelect } from '@hooks/useSimulatorSelect'
import AchievementDegree from '@containers/AchievementDegree'
import SVGNewCollection from '@public/svg/collection_new.svg'
import {FolderFrameVariant} from '@components/FolderFrame'
import AchievementIcon from '@containers/AchievementIcon'
import {sortDesc, sortTop} from '@helper/sort-modules'
import { searchModules } from '@helper/search-modules'
import { useTermSelect } from '@hooks/useTermSelect'
import Module from '@containers/Collection/Module'
import Groups from '@containers/Collection/Groups'
import SVGEdit from '@public/svg/greasepencil.svg'
import { filterDeletedTerms } from '@helper/terms'
import { getLastStudyModule } from '@helper/study'
import DialogShare from '@containers/DialogShare'
import React, { useMemo, useState } from 'react'
import FolderGroup from '@entities/FolderGroup'
import { ModuleData } from '@entities/Module'
import SVGTrash from '@public/svg/trash.svg'
import { findTerms } from '@helper/relation'
import { useTranslations } from 'next-intl'
import SVGPlay from '@public/svg/play.svg'
import { useSelector } from 'react-redux'
import {useRouter} from '@i18n/routing'

enum DropDownIdEnums {
  GROUP_CREATE = 'GROUP_CREATE',
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
  }:
  {
    editable: boolean
    editId: string | null
    filter: TypeFilter
  }
) {
  const router = useRouter()
  const { terms, relationTerms } = useTermSelect()
  const { simulators, relationSimulators } = useSimulatorSelect()

  const t = useTranslations('Modules')

  const dropdownParentItems = [
    {id: DropDownIdEnums.STUDY, name: t('dropDownStudyModule'), icon: SVGPlay },
    {id: DropDownIdEnums.OPEN_FOLDER, name: t('dropDownEditModule'), icon: SVGEdit },
    {id: DropDownIdEnums.GROUP_CREATE, name: t('dropDownCreateGroup'), icon: SVGNewCollection },
    // {id: DropDownIdEnums.SHARE, name: t('dropDownGenerateShare'), icon: SVGLinked },
    {id: '2', divider: true },
    {id: DropDownIdEnums.REMOVE_FOLDER, name: t('dropDownRemoveModule'), icon: SVGTrash },
  ]
  const modules = useSelector(({ modules }: { modules: ModuleData[] }) => modules)

  const [ originModule, setOriginModule ] = useState<ModuleData | null>(null)
  const [ removeModule, setRemoveModule ] = useState<ModuleData | null>(null)
  const [ share, setShare ] = useState<ModuleData | null>(null)

  const lastStudyModule = useMemo(() => {
    return getLastStudyModule(modules, relationSimulators, simulators)
  }, [modules, relationSimulators, simulators])

  const visibleModules = useMemo(() => {
    const rawModules = searchModules([...modules || []], filter.search || null, editId)
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
              {t('noModulesHelper', { btnName: t('btnCreateModule') })}
            </div>
          </div>
        }

        {visibleModules.map((module, index) => {
          const moduleTerms = findTerms(relationTerms, terms, { moduleId: module.id })
          const notRemovedTerms = filterDeletedTerms(moduleTerms)
          const activeSimulators = findActiveSimulators(relationSimulators, simulators, { moduleId: module.id })

          const isLastStudy = lastStudyModule?.id === module.id

          return (
            <Module
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
                      router.push(`/private/modules/${module.id}`)
                      break
                    case DropDownIdEnums.STUDY:
                      router.push(`/simulator?moduleId=${module.id}`)
                      break
                    case DropDownIdEnums.REMOVE_FOLDER:
                      setRemoveModule(module)
                      break
                    case DropDownIdEnums.GROUP_CREATE:
                      const folderGroup = new FolderGroup()
                      .setModuleId(module.id)
                      .serialize()

                      actionUpdateFolderGroup({
                        editId: folderGroup.id,
                        folderGroup,
                        editable
                      })
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
                      {t('labelActive')}
                    </MetaLabel>
                  }

                  <MetaLabel>
                    {t('labelTerms', { count: notRemovedTerms.length })}
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
                <Groups
                  module={module}
                  editable={editable}
                />
              }
            </Module>
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
