'use client'

import {actionUpdateFolderGroup, actionUpdateModule} from '@store/action-main'
import MetaLabel, {MetaLabelVariant} from '@components/MetaLabel'
import { findActiveSimulators } from '@helper/simulators/general'
import DialogRemoveModule from '@containers/DialogRemoveModule'
import AchievementDegree from '@containers/AchievementDegree'
import SVGNewCollection from '@public/svg/collection_new.svg'
import { ModuleFiltersData } from '@entities/ModuleFilters'
import {FolderFrameVariant} from '@components/FolderFrame'
import AchievementIcon from '@containers/AchievementIcon'
import { findTermsWithRelations } from '@helper/relation'
import { useMainSelector } from '@hooks/useMainSelector'
import { searchModules } from '@helper/search-modules'
import { OrderEnum, ORDER_DEFAULT} from '@helper/sort'
import Module from '@containers/Collection/Module'
import Groups from '@containers/Collection/Groups'
import SVGEdit from '@public/svg/greasepencil.svg'
import { getLastStudyModule } from '@helper/study'
import DialogShare from '@containers/DialogShare'
import { sortModules} from '@helper/sort-modules'
import React, { useMemo, useState } from 'react'
import FolderGroup from '@entities/FolderGroup'
import { MarkersEnum } from '@entities/Marker'
import SVGLinked from '@public/svg/linked.svg'
import { ModuleData } from '@entities/Module'
import SVGTrash from '@public/svg/trash.svg'
import { useTranslations } from 'next-intl'
import SVGPlay from '@public/svg/play.svg'
import { useRouter } from '@i18n/routing'

enum DropDownIdEnums {
  GROUP_CREATE = 'GROUP_CREATE',
  OPEN_FOLDER = 'OPEN_FOLDER',
  REMOVE_FOLDER = 'REMOVE_FOLDER',
  SHARE = 'SHARE',
  STUDY = 'STUDY',
}

export type TypeOptions = {
  limit: number | null,
  search: string | null
  order: OrderEnum,
  filter: ModuleFiltersData
}

export default function Modules(
  {
    editId,
    editable,
    options,
  }:
  {
    editable: boolean
    editId: string | null
    options: TypeOptions
  }
) {
  const router = useRouter()
  const terms = useMainSelector(({ terms }) => terms)
  const modules = useMainSelector(({ modules }) => modules)
  const simulators = useMainSelector(({ simulators }) => simulators)
  const relationTerms = useMainSelector(({ relationTerms }) => relationTerms)
  const relationSimulators = useMainSelector(({ relationSimulators }) => relationSimulators)

  const t = useTranslations('Modules')
  const tl = useTranslations('Labels')

  const labels = [
    {id: MarkersEnum.focus, name: tl('focus')},
    {id: MarkersEnum.important, name: tl('important')}
  ]

  const dropdownParentItems = [
    {id: DropDownIdEnums.GROUP_CREATE, name: t('dropDownCreateGroup'), icon: SVGNewCollection },
    {id: DropDownIdEnums.OPEN_FOLDER, name: t('dropDownEditModule'), icon: SVGEdit },
    {id: DropDownIdEnums.STUDY, name: t('dropDownStudyModule'), icon: SVGPlay },
    {id: DropDownIdEnums.SHARE, name: t('dropDownGenerateShare'), icon: SVGLinked },
    {id: 1, divider: true },
    {id: DropDownIdEnums.REMOVE_FOLDER, name: t('dropDownRemoveModule'), icon: SVGTrash },
  ]

  const [ originModule, setOriginModule ] = useState<ModuleData | null>(null)
  const [ removeModule, setRemoveModule ] = useState<ModuleData | null>(null)
  const [ share, setShare ] = useState<ModuleData | null>(null)

  const lastStudyModule = useMemo(() => {
    return getLastStudyModule(modules, relationSimulators, simulators)
  }, [modules, relationSimulators, simulators])

  const visibleModules = useMemo(() => {
    const rawModules = searchModules([...modules || []], options.search || null, editId)
    return sortModules(rawModules, options.order || ORDER_DEFAULT)
      .slice(0, options.limit || Infinity)
  }, [modules, editId, options])

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

        {visibleModules.map((module) => {
          const notRemovedTerms =findTermsWithRelations(relationTerms, terms, { moduleId: module.id })
          const activeSimulators = findActiveSimulators(relationSimulators, simulators, { moduleId: module.id })

          const isLastStudy = lastStudyModule?.id === module.id

          if (options.filter.marker === MarkersEnum.active && activeSimulators.length === 0) {
            return
          }

          if (options.filter.marker && [MarkersEnum.focus, MarkersEnum.important].includes(options.filter.marker)) {
            if (!module.markers.includes(options.filter.marker)) {
              return
            }
          }

          return (
            <Module
              data={module}
              key={module.id}
              collapsed={module.collapsed}
              variant={isLastStudy ? FolderFrameVariant.blue : FolderFrameVariant.default}
              title={(
                <div className="flex gap-2 items-center">

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
                      router.push(`/private/simulator/module/${module.id}`)
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
                      className="px-2"
                      variant={MetaLabelVariant.amber}
                    >
                      {tl('active')}
                    </MetaLabel>
                  }

                  {module.markers.map((marker) => {
                    const item = labels.find(({ id }) => marker === id)
                    if (!item) {
                      return
                    }

                    return (
                      <MetaLabel
                        key={marker}
                      >
                        {item.name}
                      </MetaLabel>
                    )
                  })}

                  <MetaLabel>
                    {notRemovedTerms.length}
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
