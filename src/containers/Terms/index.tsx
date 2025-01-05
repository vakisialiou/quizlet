'use client'

import { filterDeletedTerms, filterEmptyTerms } from '@helper/terms'
import { findTerms, RelationProps } from '@helper/relation'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import Button, {ButtonVariant} from '@components/Button'
import React, { useMemo, useState, useRef } from 'react'
import { useTermSelect } from '@hooks/useTermSelect'
import ButtonSquare from '@components/ButtonSquare'
import SVGQuestion from '@public/svg/question.svg'
import ContentPage from '@containers/ContentPage'
import SVGFileNew from '@public/svg/file_new.svg'
import FolderTitle from '@containers/FolderTitle'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import SVGPlay from '@public/svg/play.svg'
import Grid from '@containers/Terms/Grid'
import {useRouter} from '@i18n/routing'
import Dialog from '@components/Dialog'
import clsx from 'clsx'

export default function Terms({ relation }: { relation: RelationProps }) {
  const router = useRouter()
  const { terms, relationTerms } = useTermSelect()

  const rawTerms = useMemo(() => {
    return findTerms(relationTerms, terms, relation)
  }, [relationTerms, terms, relation])

  const playTerms = useMemo(() => {
    return filterDeletedTerms(filterEmptyTerms(rawTerms))
  }, [rawTerms])

  const [ search, setSearch ] = useState<string>('')
  const [ showUserHelp, setShowUserHelp ] = useState(false)

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
                {t('footButtonCreateTerm')}
              </Button>

              <Button
                variant={ButtonVariant.GREEN}
                disabled={playTerms.length === 0}
                className="w-1/2 gap-1"
                onClick={() => {
                  if (relation.moduleId) {
                    router.push(`/simulator?moduleId=${relation.moduleId}`)
                  } else if (relation.folderId) {
                    router.push(`/simulator?folderId=${relation.folderId}`)
                  }
                }}
              >
                <SVGPlay
                  width={28}
                  height={28}
                  className={clsx('text-gray-100', {
                    ['text-gray-500/50']: playTerms.length === 0
                  })}
                />
                {t('footButtonPlay')}
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
        editable={true}
        filter={{ search }}
        relation={relation}
      />

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
