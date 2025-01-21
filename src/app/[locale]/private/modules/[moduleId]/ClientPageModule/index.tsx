'use client'

import {
  actionUpdateModule,
  actionUpdateFolderGroup,
  actionCreateRelationTerm,
} from '@store/index'
import { findTermsWithRelations, getModule } from '@helper/relation'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import SVGNewCollection from '@public/svg/collection_new.svg'
import TermsDropdownMenu from '@containers/TermsDropdownMenu'
import { sortTermsWithRelations } from '@helper/sort-terms'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import AchievementIcon from '@containers/AchievementIcon'
import SVGArrowDown from '@public/svg/downarrow_hlt.svg'
import Button, {ButtonVariant} from '@components/Button'
import {useModuleSelect} from '@hooks/useModuleSelect'
import Groups from '@containers/Collection/Groups'
import RelatedTerms from '@containers/RelatedTerms'
import ButtonSquare from '@components/ButtonSquare'
import {useTermSelect} from '@hooks/useTermSelect'
import ContentPage from '@containers/ContentPage'
import SVGFileNew from '@public/svg/file_new.svg'
import RelationTerm from '@entities/RelationTerm'
import FormModule from '@containers/FormModule'
import FolderGroup from '@entities/FolderGroup'
import FolderCart from '@components/FolderCart'
import MetaLabel from '@components/MetaLabel'
import Dropdown from '@components/Dropdown'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import SVGPlay from '@public/svg/play.svg'
import {useRouter} from '@i18n/routing'
import Module from '@entities/Module'
import clsx from 'clsx'

export default function ClientPageModule({ editable, moduleId }: { editable: boolean, moduleId: string }) {
  const router = useRouter()
  const { terms, relationTerms } = useTermSelect()

  const modules = useModuleSelect()
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
      module: new Module().setId(moduleId).serialize()
    })
  }, [course, editable, moduleId])

  const relatedTerms = useMemo(() => {
    return sortTermsWithRelations(findTermsWithRelations(relationTerms, terms, { moduleId }))
  }, [relationTerms, terms, moduleId])

  const excludeTermIds = useMemo(() => {
    return relatedTerms.map(({ term }) => term.id)
  }, [relatedTerms])

  const [ search, setSearch ] = useState<string>('')
  const t = useTranslations('Module')

  const ref = useRef<{ onCreate?: () => void }>({})
  const refDropdownTerms = useRef<{ close?: () => void }>({})

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
            value: search || '',
            placeholder: t('searchPlaceholder'),
            onClear: () => setSearch(''),
            onChange: ({ formattedValue }) => setSearch(formattedValue)
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
        <div className="flex flex-col gap-2">
          <FormModule
            module={course}
            editable={editable}
          />

          <FolderCart
            hover={false}
            title={t('termsTitle')}
            dropdown={{
              hidden: true
            }}
            labels={<MetaLabel>{relatedTerms.length}</MetaLabel>}
            controls={(
              <>
                <Dropdown
                  caret
                  ref={refDropdownTerms}
                  className="px-1 min-w-8 h-8 items-center"
                  menu={(
                    <TermsDropdownMenu
                      excludeTermIds={excludeTermIds}
                      className="w-56"
                      onCreate={() => {
                        if (refDropdownTerms.current.close) {
                          refDropdownTerms.current.close()
                        }

                        actionUpdateModule({ editable, editId: null, module: { ...course, termsCollapsed: false }}, () => {
                          if (ref.current?.onCreate) {
                            ref.current?.onCreate()
                          }
                        })
                      }}
                      onClick={(term) => {
                        actionUpdateModule({ editable, editId: null, module: { ...course, termsCollapsed: false }}, () => {
                          const relationTerm = new RelationTerm()
                            .setModuleId(moduleId)
                            .setTermId(term.id)
                            .serialize()

                          actionCreateRelationTerm({ relationTerm, editable })
                        })
                      }}
                    />
                  )}
                >
                  <SVGFileNew
                    width={18}
                    height={18}
                  />
                </Dropdown>

                <ButtonSquare
                  size={24}
                  icon={SVGArrowDown}
                  onClick={() => {
                    actionUpdateModule({
                      editable,
                      editId: null,
                      module: { ...course, termsCollapsed: !course.termsCollapsed }
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
                {editable && relatedTerms.length === 0 &&
                  <div className="italic text-xs text-center text-white/50">
                    {t('noCardsHelper')}
                  </div>
                }

                <RelatedTerms
                  ref={ref}
                  shareId={null}
                  filter={{search }}
                  editable={editable}
                  relation={{ moduleId }}
                  relatedTerms={relatedTerms}
                />
              </>
            }
          </FolderCart>

          <FolderCart
            hover={false}
            title={t('groupsTitle')}
            dropdown={{hidden: true}}
            controls={(
              <>
                <ButtonSquare
                  size={18}
                  icon={SVGNewCollection}
                  onClick={() => {
                    const folderGroup = new FolderGroup()
                      .setModuleId(course.id)
                      .serialize()

                    actionUpdateFolderGroup({
                      editId: folderGroup.id,
                      folderGroup,
                      editable
                    })
                  }}
                />

                <ButtonSquare
                  size={24}
                  icon={SVGArrowDown}
                  onClick={() => {
                    actionUpdateModule({
                      editable,
                      editId: null,
                      module: { ...course, groupsCollapsed: !course.groupsCollapsed }
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
        </div>
      }
    </ContentPage>
  )
}
