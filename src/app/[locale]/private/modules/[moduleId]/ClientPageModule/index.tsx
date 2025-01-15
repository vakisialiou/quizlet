'use client'

import { actionUpdateModule, actionCreateRelationTerm } from '@store/index'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import TermsDropdownMenu from '@containers/TermsDropdownMenu'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import AchievementIcon from '@containers/AchievementIcon'
import Button, {ButtonVariant} from '@components/Button'
import { findTerms, getModule } from '@helper/relation'
import {useModuleSelect} from '@hooks/useModuleSelect'
import SVGFileBlank from '@public/svg/file_blank.svg'
import Groups from '@containers/Collection/Groups'
import RelatedTerms from '@containers/RelatedTerms'
import ButtonSquare from '@components/ButtonSquare'
import {useTermSelect} from '@hooks/useTermSelect'
import SVGQuestion from '@public/svg/question.svg'
import ContentPage from '@containers/ContentPage'
import SVGFileNew from '@public/svg/file_new.svg'
import RelationTerm from '@entities/RelationTerm'
import {filterDeletedTerms} from '@helper/terms'
import FormModule from '@containers/FormModule'
import FolderCart from '@components/FolderCart'
import Dropdown from '@components/Dropdown'
import {useTranslations} from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import {useRouter} from '@i18n/routing'
import Dialog from '@components/Dialog'
import Module from '@entities/Module'

export default function ClientPageModule({ editable, moduleId }: { editable: boolean, moduleId: string }) {
  const router = useRouter()
  const { terms, relationTerms } = useTermSelect()

  const modules = useModuleSelect()
  const module = useMemo(() => {
    return getModule(modules, moduleId)
  }, [modules, moduleId])

  const initRef = useRef(true)

  useEffect(() => {
    if (module) {
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
  }, [module, moduleId])


  const relatedTerms = useMemo(() => {
    return filterDeletedTerms(findTerms(relationTerms, terms, { moduleId }))
  }, [relationTerms, terms, moduleId])

  const [ search, setSearch ] = useState<string>('')
  const [ showUserHelp, setShowUserHelp ] = useState(false)

  const t = useTranslations('Module')

  const ref = useRef<{ onCreate?: () => void }>({})

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
                degreeRate={module ? module.degreeRate : 0}
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
            icon={SVGQuestion}
            disabled={showUserHelp}
            onClick={() => setShowUserHelp(true)}
          />

          <ButtonSquare
            icon={SVGBack}
            onClick={() => {
              router.push(`/private`)
            }}
          />
        </>
      )}
      footer={(
        <div className="flex w-full justify-center text-center">
          <Button
            variant={ButtonVariant.WHITE}
            className="w-full max-w-96"
            onClick={() => {
              if (ref.current?.onCreate) {
                ref.current?.onCreate()
              }
            }}
          >
            <SVGFileBlank
              width={28}
              height={28}
              className="text-gray-700"
            />
            {t('footButtonCreateTerm')}
          </Button>
        </div>
      )}
    >
      {module &&
        <div className="flex flex-col gap-2">
          <FormModule
            module={module}
            editable={editable}
          />

          <FolderCart
            hover={false}
            title={'Группы'}
            dropdown={{hidden: true}}
            controls={(
              <></>
            )}
          >
            <Groups
              module={module}
              editable={editable}
            />
          </FolderCart>


          <FolderCart
            hover={false}
            title={'Термины'}
            dropdown={{
              hidden: true
            }}
            controls={(
              <>
                <ButtonSquare
                  size={18}
                  icon={SVGFileBlank}
                  onClick={() => {
                    if (ref.current?.onCreate) {
                      ref.current?.onCreate()
                    }
                  }}
                />
                <Dropdown
                  caret
                  className="px-2 min-w-8 h-8 items-center"
                  menu={(
                    <TermsDropdownMenu
                      excludeTerms={relatedTerms}
                      className="w-56"
                      onClick={(term) => {
                        const relationTerm = new RelationTerm()
                          .setModuleId(moduleId)
                          .setTermId(term.id)
                          .serialize()

                        actionCreateRelationTerm({ relationTerm, editable })
                      }}
                    />
                  )}
                >
                  <SVGFileNew
                    width={18}
                    height={18}
                  />
                </Dropdown>
              </>
            )}
          >
            {editable && relatedTerms.length === 0 &&
              <div className="flex flex-col w-full items-center justify-center gap-2 p-4">
                <div className="text-white/50 text-sm italic text-center">
                  {t('noCardsHelper', { btnName: t('footButtonCreateTerm') })}
                </div>
              </div>
            }

            <RelatedTerms
              ref={ref}
              shareId={null}
              filter={{ search }}
              editable={editable}
              relation={{ moduleId }}
              relatedTerms={relatedTerms}
            />
          </FolderCart>
        </div>
      }

      {showUserHelp &&
        <Dialog
          title={t('userHelpTitle')}
          onClose={() => setShowUserHelp(false)}
          text={(
            <div className="flex flex-col gap-4 text-gray-800">

              <div className="flex flex-col gap-1">
                <div className="font-bold">{t('userHelpSection1Title')}</div>
                {t('userHelpSection1Text')}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-bold">{t('userHelpSection2Title')}</div>
                {t('userHelpSection2Text')}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-bold">{t('userHelpSection3Title')}</div>
                {t('userHelpSection3Text')}
              </div>
            </div>
          )}
        >
          <Button
            className="min-w-28 px-4"
            variant={ButtonVariant.GRAY}
            onClick={() => setShowUserHelp(false)}
          >
            {t('userHelpButtonClose')}
          </Button>
        </Dialog>
      }
    </ContentPage>
  )
}
