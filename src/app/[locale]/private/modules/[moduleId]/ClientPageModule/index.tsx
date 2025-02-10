'use client'

import {
  actionUpdateModule,
  actionUpdateFolderGroup,
  actionCreateRelationTerm,
} from '@store/action-main'
import { findFolderGroups, findTermsWithRelations, getModule } from '@helper/relation'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Button, { ButtonSize, ButtonVariant } from '@components/Button'
import Module, { ModuleData, ModuleTabId } from '@entities/Module'
import SVGNewCollection from '@public/svg/collection_new.svg'
import FilterRelatedTerm from '@containers/FilterRelatedTerm'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import AchievementIcon from '@containers/AchievementIcon'
import { COLOR_DEFAULT } from '@components/ColorLabel'
import {useMainSelector} from '@hooks/useMainSelector'
import SVGThreeDots from '@public/svg/three_dots.svg'
import SVGFileSearch from '@public/svg/zoom_all.svg'
import RelatedTerms from '@containers/RelatedTerms'
import ButtonSquare from '@components/ButtonSquare'
import Groups from '@containers/Collection/Groups'
import ContentPage from '@containers/ContentPage'
import RelationTerm from '@entities/RelationTerm'
import SVGFileNew from '@public/svg/file_new.svg'
import FormModule from '@containers/FormModule'
import FolderGroup from '@entities/FolderGroup'
import MetaLabel from '@components/MetaLabel'
import TermsMenu from '@containers/TermsMenu'
import Dropdown from '@components/Dropdown'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import SVGPlay from '@public/svg/play.svg'
import { OrderEnum } from '@helper/sort'
import {useRouter} from '@i18n/routing'
import Tabs from '@components/Tabs'

export default function ClientPageModule({ editable, moduleId }: { editable: boolean, moduleId: string }) {
  const router = useRouter()

  const terms = useMainSelector(({ terms }) => terms)
  const modules = useMainSelector(({ modules }) => modules)
  const folderGroups = useMainSelector(({ folderGroups }) => folderGroups)
  const relationTerms = useMainSelector(({ relationTerms }) => relationTerms)

  const moduleFolderGroups = useMemo(() => {
    return findFolderGroups(folderGroups, moduleId)
  }, [folderGroups, moduleId])

  const [searchTerm, setSearchTerm] = useState(false)

  const course = useMemo(() => {
    return getModule(modules, moduleId)
  }, [modules, moduleId])

  const initRef = useRef(true)

  useEffect(() => {
    if (course) {
      return
    }

    if (!initRef.current) {
      return
    }

    initRef.current = false

    actionUpdateModule({
      editable,
      editId: null,
      module: new Module()
        .setId(moduleId)
        .setOrder(modules.length + 1)
        .serialize()
    })
  }, [course, editable, moduleId, modules.length])

  const relatedTerms = useMemo(() => {
    return findTermsWithRelations(relationTerms, terms, { moduleId })
  }, [relationTerms, terms, moduleId])

  const excludeTermIds = useMemo(() => {
    return relatedTerms.map(({ term }) => term.id)
  }, [relatedTerms])

  const [ search, setSearch ] = useState<string>('')
  const t = useTranslations('Module')

  const ref = useRef<{ onCreate?: (color?: number) => void }>({})

  const onCreateTerm = useCallback((moduleData: ModuleData, callback?: () => void) => {
    const { color } = moduleData.termSettings.filter

    if (ref.current?.onCreate) {
      ref.current?.onCreate(color === -1 ? COLOR_DEFAULT : color)
    }
    if (callback) {
      callback()
    }
  }, [])

  const onCreateGroup = useCallback((moduleId: string) => {
    const folderGroup = new FolderGroup()
      .setModuleId(moduleId)
      .serialize()

    actionUpdateFolderGroup({
      editId: folderGroup.id,
      folderGroup,
      editable
    })
  }, [editable])

  const activeTabId = useMemo(() => {
    return course?.activeTab || ModuleTabId.cards
  }, [course?.activeTab])

  return (
    <ContentPage
      showHeader
      showFooter={activeTabId ===  ModuleTabId.cards}
      options={{
        padding: true,
        scrollbarGutter: true,
      }}
      title={(
        <HeaderPageTitle
          title={(
            <div className="flex gap-2 items-center">
              <AchievementIcon
                degreeRate={course ? course.degreeRate : 0}
                showDefault
                size={18}
              />
              {t('headTitle')}
            </div>
          )}
          search={{
            hidden: activeTabId !==  ModuleTabId.cards,
            value: search,
            placeholder: t('searchPlaceholder'),
            onClear: () => {
              setSearch('')
            },
            onChange: ({ formattedValue }) => {
              setSearch(formattedValue)
            }
          }}
        />
      )}
      rightControls={(
        <>
          <ButtonSquare
            icon={SVGBack}
            onClick={() => router.back()}
          />
        </>
      )}
      footer={(
        <div className="flex w-full justify-center text-center">
          <Button
            className="gap-2 w-full max-w-96"
            variant={ButtonVariant.GREEN}
            disabled={relatedTerms.length === 0}
            onClick={() => {
              router.push(`/private/simulator/module/${moduleId}`)
            }}
          >
            <SVGPlay
              width={28}
              height={28}
            />
            {t('btnPlay')}
          </Button>
        </div>
      )}
    >
      {course &&
        <>
          <div className="flex flex-col gap-2">
            <FormModule
              module={course}
              className="mb-2"
              editable={editable}
            />

            <Tabs
              className="gap-2"
              tabs={[
                {
                  id:  ModuleTabId.cards,
                  name: t('termsTitle'),
                  contentCallback: () => {
                    return (
                      <>
                        <FilterRelatedTerm
                          className="mx-1"
                          selectedOrderId={course.termSettings.order}
                          selectedFilterId={course.termSettings.filter.color}
                          onFilterSelect={(color) => {
                            actionUpdateModule({
                              editable,
                              editId: null,
                              module: {
                                ...course,
                                termSettings: {
                                  ...course.termSettings,
                                  filter: {...course.termSettings.filter, color: color as number}
                                }
                              }
                            })
                          }}
                          onOrderSelect={(order) => {
                            actionUpdateModule({
                              editable,
                              editId: null,
                              module: {
                                ...course,
                                termSettings: {...course.termSettings, order: order as OrderEnum}
                              }
                            })
                          }}
                        />

                        <div className="flex gap-2 items-center justify-between mx-1">
                          <MetaLabel># {relatedTerms.length}</MetaLabel>

                          <Dropdown
                            className="w-8 min-w-8 h-8 items-center"
                            items={[
                              {id: 1, name: t('btnAddCard'), icon: SVGFileSearch},
                              {id: 2, name: t('btnCreateCard'), icon: SVGFileNew},
                            ]}
                            onSelect={(id) => {
                              if (!course) {
                                return
                              }
                              switch (id) {
                                case 1:
                                  setSearchTerm(true)
                                  break
                                case 2:
                                  onCreateTerm(course)
                                  break
                              }
                            }}
                          >
                            <SVGThreeDots
                              width={24}
                              height={24}
                            />
                          </Dropdown>
                        </div>

                        {editable && relatedTerms.length === 0 &&
                          <div className="italic text-xs text-center text-white/50 my-4">
                            {t('noCardsHelper')}
                          </div>
                        }

                        <RelatedTerms
                          ref={ref}
                          search={search}
                          editable={editable}
                          relation={{moduleId}}
                          relatedTerms={relatedTerms}
                          order={course.termSettings.order}
                          filter={course.termSettings.filter}
                        />

                        <div
                          className="flex w-full gap-2 justify-between sm:justify-end items-center py-4">
                          <Button
                            size={ButtonSize.H08}
                            className="px-1 w-1/2 sm:w-auto sm:px-4 gap-1"
                            variant={ButtonVariant.WHITE}
                            onClick={() => setSearchTerm(true)}
                          >
                            <SVGFileSearch
                              width={18}
                              height={18}
                            />

                            {t('btnAddCard')}
                          </Button>

                          <Button
                            size={ButtonSize.H08}
                            className="px-1 w-1/2 sm:w-auto sm:px-4 gap-1"
                            variant={ButtonVariant.WHITE}
                            onClick={() => onCreateTerm(course)}
                          >
                            <SVGFileNew
                              width={18}
                              height={18}
                            />

                            {t('btnCreateCard')}
                          </Button>
                        </div>
                      </>
                    )
                  }
                },
                {
                  id:  ModuleTabId.sections,
                  name: t('groupsTitle'),
                  contentCallback: () => {
                    return (
                      <>
                        <div className="flex gap-2 items-center justify-between mx-1">
                          <MetaLabel># {moduleFolderGroups.length}</MetaLabel>

                          <Dropdown
                            className="w-8 min-w-8 h-8 items-center"
                            items={[
                              {id: 1, name: t('btnCreateGroup'), icon: SVGNewCollection},
                            ]}
                            onSelect={(id) => {
                              switch (id) {
                                case 1:
                                  onCreateGroup(course.id)
                              }
                            }}
                          >
                            <SVGThreeDots
                              width={24}
                              height={24}
                            />
                          </Dropdown>
                        </div>

                        <Groups
                          module={course}
                          editable={editable}
                        />

                        <div
                          className="flex w-full justify-end py-4"
                        >
                          <Button
                            size={ButtonSize.H08}
                            className="w-auto px-4 gap-1"
                            variant={ButtonVariant.WHITE}
                            onClick={() => {
                              onCreateGroup(course.id)
                            }}
                          >
                            <SVGNewCollection
                              width={18}
                              height={18}
                            />

                            {t('btnCreateGroup')}
                          </Button>
                        </div>
                      </>
                    )
                  }
                },
              ]}
              active={activeTabId}
              onSelect={(tab) => {
                actionUpdateModule({
                  editable,
                  editId: null,
                  module: { ...course, activeTab: tab.id as ModuleTabId }
                })
              }}
            />
          </div>

          {searchTerm &&
            <TermsMenu
              excludeTermIds={excludeTermIds}
              onClose={() => setSearchTerm(false)}
              onCreate={() => {
                onCreateTerm(course, () => {
                  setSearchTerm(false)
                })
              }}
              onClick={(term) => {
                const {color} = course.termSettings.filter

                const relationTerm = new RelationTerm()
                  .setOrder(relatedTerms.length + 1)
                  .setColor(color === -1 ? COLOR_DEFAULT : color)
                  .setModuleId(moduleId)
                  .setTermId(term.id)
                  .serialize()

                actionCreateRelationTerm({relationTerm, editable})
              }}
            />
          }
        </>
      }
    </ContentPage>
  )
}
