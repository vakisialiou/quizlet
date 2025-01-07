'use client'

import { filterDeletedTerms, filterEmptyTerms } from '@helper/terms'
import SearchTermList from '@containers/RelatedTerms/SearchTermList'
import { findTerms, RelationProps } from '@helper/relation'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import Button, {ButtonVariant} from '@components/Button'
import React, { useMemo, useState, useRef } from 'react'
import { actionCreateRelationTerm } from '@store/index'
import { useTermSelect } from '@hooks/useTermSelect'
import ButtonSquare from '@components/ButtonSquare'
import SVGQuestion from '@public/svg/question.svg'
import RelationTerm from '@entities/RelationTerm'
import ContentPage from '@containers/ContentPage'
import SVGFileNew from '@public/svg/file_new.svg'
import FolderTitle from '@containers/FolderTitle'
import Grid from '@containers/RelatedTerms/Grid'
import SVGZoomIn from '@public/svg/zoom_in.svg'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import {useRouter} from '@i18n/routing'
import Dialog from '@components/Dialog'
import clsx from 'clsx'

export default function RelatedTerms({ editable, relation }: { editable: boolean, relation: RelationProps }) {
  const router = useRouter()
  const { terms, relationTerms } = useTermSelect()

  const relatedTerms = useMemo(() => {
    return filterDeletedTerms(findTerms(relationTerms, terms, relation))
  }, [relationTerms, terms, relation])

  const [ search, setSearch ] = useState<string>('')
  const [ showUserHelp, setShowUserHelp ] = useState(false)
  const [ showSearchTerms, setShowSearchTerms ] = useState(false)

  const t = useTranslations('Terms')

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
          title={t('headTitle')}
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
        <>
          <div className="flex w-full justify-center text-center">
            <div className="flex gap-2 w-full max-w-96">
              <Button
                variant={ButtonVariant.WHITE}
                className="w-1/2 gap-1"
                onClick={() => {
                  if (ref.current?.onCreate) {
                    ref.current?.onCreate()
                  }
                }}
              >
                <SVGFileNew
                  width={28}
                  height={28}
                  className="text-gray-700"
                />
                Создать
                {/*{t('footButtonCreateTerm')}*/}
              </Button>

              <Button
                variant={ButtonVariant.WHITE}
                className="w-1/2 gap-1"
                onClick={() => setShowSearchTerms(true)}
              >
                <SVGZoomIn
                  width={28}
                  height={28}
                  className={clsx('text-gray-100')}
                />

                Добавить
                {/*{t('footButtonPlay')}*/}
              </Button>
            </div>
          </div>
        </>
      )}
    >
      <FolderTitle
        className="mb-4"
        relation={relation}
      />

      <Grid
        ref={ref}
        shareId={null}
        filter={{ search }}
        editable={editable}
        relation={relation}
        relatedTerms={relatedTerms}
      />

      {showSearchTerms &&
        <SearchTermList
          excludeTerms={relatedTerms}
          className="absolute left-1.5 top-1.5 w-[calc(100%-20px)] h-[calc(100%-12px)] z-10 border border-white/15"
          onClick={(term) => {
            const relationTerm = new RelationTerm()
              .setModuleId(relation.moduleId || null)
              .setFolderId(relation.folderId || null)
              .setTermId(term.id)
              .serialize()

            actionCreateRelationTerm({ relationTerm, editable })
          }}
          onClose={() => {
            setShowSearchTerms(false)
          }}
        />
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
