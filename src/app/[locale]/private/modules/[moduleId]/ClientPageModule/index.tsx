'use client'

import {
  actionUpdateModule,
  actionUpdateFolderGroup,
  actionCreateRelationTerm,
} from '@store/action-main'
import { findFolderGroups, findTermsWithRelations, getModule } from '@helper/relation'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Button, { ButtonSize, ButtonVariant } from '@components/Button'
import SVGNewCollection from '@public/svg/collection_new.svg'
import FilterRelatedTerm from '@containers/FilterRelatedTerm'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import AchievementIcon from '@containers/AchievementIcon'
import SVGArrowDown from '@public/svg/downarrow_hlt.svg'
import { COLOR_DEFAULT } from '@components/ColorLabel'
import {useMainSelector} from '@hooks/useMainSelector'
import Module, { ModuleData } from '@entities/Module'
import SVGFileSearch from '@public/svg/zoom_all.svg'
import RelatedTerms from '@containers/RelatedTerms'
import { DEFAULT_GROUP_SIZE } from '@helper/groups'
import ButtonSquare from '@components/ButtonSquare'
import Groups from '@containers/Collection/Groups'
import ContentPage from '@containers/ContentPage'
import RelationTerm from '@entities/RelationTerm'
import SVGFileNew from '@public/svg/file_new.svg'
import FormModule from '@containers/FormModule'
import FolderGroup from '@entities/FolderGroup'
import FolderCart from '@components/FolderCart'
import MetaLabel from '@components/MetaLabel'
import TermsMenu from '@containers/TermsMenu'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import SVGPlay from '@public/svg/play.svg'
import { OrderEnum } from '@helper/sort'
import {useRouter} from '@i18n/routing'
import clsx from 'clsx'

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

    if (moduleData.termsCollapsed) {
      actionUpdateModule({
        editable,
        editId: null,
        module: {...moduleData, termsCollapsed: false}
      }, () => {
        if (ref.current?.onCreate) {
          ref.current?.onCreate(color === -1 ? COLOR_DEFAULT : color)
        }
        if (callback) {
          callback()
        }
      })
    } else {
      if (ref.current?.onCreate) {
        ref.current?.onCreate(color === -1 ? COLOR_DEFAULT : color)
      }
      if (callback) {
        callback()
      }
    }
  }, [editable])

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

  return (
    <ContentPage
      showHeader
      showFooter
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

            <FolderCart
              hover={false}
              title={t('termsTitle')}
              dropdown={{
                hidden: !course,
                items: [
                  {id: 1, name: t('btnAddCard'), icon: SVGFileSearch},
                  {id: 2, name: t('btnCreateCard'), icon: SVGFileNew},
                  {id: 3, name: t('btnCreateGroup'), icon: SVGNewCollection, disabled: relatedTerms.length < DEFAULT_GROUP_SIZE},
                ],
                onSelect: (id) => {
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
                    case 3:
                      onCreateGroup(course.id)
                      break
                  }
                }
              }}
              labels={<MetaLabel>{relatedTerms.length}</MetaLabel>}
              controls={(
                <>
                  <ButtonSquare
                    size={24}
                    icon={SVGArrowDown}
                    onClick={() => {
                      actionUpdateModule({
                        editable,
                        editId: null,
                        module: {...course, termsCollapsed: !course.termsCollapsed}
                      })
                    }}
                    classNameIcon={clsx('', {
                      ['rotate-180']: !course.termsCollapsed
                    })}
                  />
                </>
              )}
            >
              {!course.termsCollapsed &&
                <>
                  <FilterRelatedTerm
                    className="border-b pb-2 border-white/15"
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

                  {editable && relatedTerms.length === 0 &&
                    <div className="italic text-xs text-center text-white/50">
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
                </>
              }

              <div className="flex w-full mt-2 gap-2 justify-between sm:justify-end items-center">
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
            </FolderCart>

            {moduleFolderGroups.length > 0 &&
              <FolderCart
                hover={false}
                title={t('groupsTitle')}
                dropdown={{hidden: true}}
                controls={(
                  <>
                    <ButtonSquare
                      size={18}
                      icon={SVGNewCollection}
                      onClick={() => onCreateGroup(course.id)}
                    />

                    <ButtonSquare
                      size={24}
                      icon={SVGArrowDown}
                      onClick={() => {
                        actionUpdateModule({
                          editable,
                          editId: null,
                          module: {...course, groupsCollapsed: !course.groupsCollapsed}
                        })
                      }}
                      classNameIcon={clsx('', {
                        ['rotate-180']: !course.groupsCollapsed
                      })}
                    />
                  </>
                )}
              >
                {!course.groupsCollapsed &&
                  <Groups
                    module={course}
                    editable={editable}
                  />
                }
              </FolderCart>
            }
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
                const { color } = course.termSettings.filter

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
