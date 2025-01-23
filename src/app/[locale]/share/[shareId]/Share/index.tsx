'use client'

import Button, { ButtonVariant } from '@components/Button'
import { useShareSelector } from '@hooks/useShapeSelector'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import { ModuleShareEnum } from '@entities/ModuleShare'
import TitleModule from '@containers/TitleModule'
import SVGFileNew from '@public/svg/file_new.svg'
import ContentPage from '@containers/ContentPage'
import React, { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import Grid from './Grid'

export default function Share() {
  const [ search, setSearch ] = useState<string>('')

  const share = useShareSelector((state) => state.share)
  const course = useShareSelector((state) => state.module)

  const t = useTranslations('Share')

  const ref = useRef<{ onCreate?: () => void }>({})
  const editable = share.access === ModuleShareEnum.editable

  return (
    <ContentPage
      showHeader
      showFooter={editable}
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
      footer={(
        <>
          <div className="flex w-full justify-center text-center">
            <div className="flex gap-2 w-full max-w-96">
              <Button
                variant={ButtonVariant.WHITE}
                className="w-full gap-1"
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
                {t('btnAddTerm')}
              </Button>
            </div>
          </div>
        </>
      )}
    >
      <TitleModule
        module={course}
        className="mb-4"
      />

      <Grid
        ref={ref}
        share={share}
        filter={{ search }}
        editable={editable}
      />
    </ContentPage>
  )
}
