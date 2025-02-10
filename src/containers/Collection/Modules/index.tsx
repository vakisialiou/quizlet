'use client'

import Button, {ButtonSize, ButtonVariant} from '@components/Button'
import MetaLabel, {MetaLabelVariant} from '@components/MetaLabel'
import {findActiveSimulators} from '@helper/simulators/general'
import DialogRemoveModule from '@containers/DialogRemoveModule'
import AchievementDegree from '@containers/AchievementDegree'
import {FolderFrameVariant} from '@components/FolderFrame'
import SVGCollection from '@public/svg/collection_new.svg'
import AchievementIcon from '@containers/AchievementIcon'
import {ModuleFiltersData} from '@entities/ModuleFilters'
import {ModuleData, ModuleTabId} from '@entities/Module'
import {findTermsWithRelations} from '@helper/relation'
import {useMainSelector} from '@hooks/useMainSelector'
import {actionUpdateModule} from '@store/action-main'
import {searchModules} from '@helper/search-modules'
import {ORDER_DEFAULT, OrderEnum} from '@helper/sort'
import Module from '@containers/Collection/Module'
import SVGEdit from '@public/svg/greasepencil.svg'
import {getLastStudyModule} from '@helper/study'
import DialogShare from '@containers/DialogShare'
import {sortModules} from '@helper/sort-modules'
import React, {useMemo, useState} from 'react'
import {MarkersEnum} from '@entities/Marker'
import SVGLinked from '@public/svg/linked.svg'
import SVGTrash from '@public/svg/trash.svg'
import {useTranslations} from 'next-intl'
import SVGPlay from '@public/svg/play.svg'
import {useRouter} from '@i18n/routing'

enum DropDownIdEnums {
  OPEN_FOLDER = 'OPEN_FOLDER',
  REMOVE_FOLDER = 'REMOVE_FOLDER',
  SHARE = 'SHARE',
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
    {id: DropDownIdEnums.OPEN_FOLDER, name: t('dropDownEditModule'), icon: SVGEdit },
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
        className="gap-2 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      >
        {visibleModules.length === 0 &&
          <div className="flex flex-col items-center justify-center gap-2 p-4">
            <div className="text-white/50 text-sm italic text-center">
              {t('noModulesHelper', { btnName: t('btnCreateModule') })}
            </div>
          </div>
        }

        {visibleModules.map((module) => {
          const notRemovedTerms = findTermsWithRelations(relationTerms, terms, { moduleId: module.id })
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
                      actionUpdateModule({
                        module: { ...module, activeTab: ModuleTabId.cards },
                        editId: null,
                        editable: true
                      }, () => {
                        router.push(`/private/modules/${module.id}`)
                      })
                      break
                    case DropDownIdEnums.REMOVE_FOLDER:
                      setRemoveModule(module)
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
              <div className="flex justify-between gap-2 my-2">
                <Button
                  className="w-1/2 gap-1"
                  size={ButtonSize.H06}
                  disabled={notRemovedTerms.length === 0}
                  variant={ButtonVariant.GREEN}
                  onClick={() => {
                    router.push(`/private/simulator/module/${module.id}`)
                  }}
                >
                  <SVGPlay
                    width={12}
                    height={12}
                  />
                  {t('btnPlay')}
                </Button>

                <Button
                  className="w-1/2 gap-1"
                  size={ButtonSize.H06}
                  variant={ButtonVariant.WHITE}
                  onClick={() => {
                    actionUpdateModule({
                      module: { ...module, activeTab: ModuleTabId.sections },
                      editId: null,
                      editable: true
                    }, () => {
                      router.push(`/private/modules/${module.id}`)
                    })
                  }}
                >
                  <SVGCollection
                    width={12}
                    height={12}
                  />
                  {t('btnOpenSections')}
                </Button>
              </div>
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
