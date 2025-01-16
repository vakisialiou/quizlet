'use client'

import HeaderPageTitle from '@containers/HeaderPageTitle'
import Button, {ButtonVariant} from '@components/Button'
import SVGFileBlank from '@public/svg/file_blank.svg'
import ContentPage from '@containers/ContentPage'
import React, { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Grid from '@containers/Terms/Grid'

export default function Terms() {
  const t = useTranslations('Terms')
  const [ search, setSearch ] = useState<string>('')
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
                <SVGFileBlank
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
      <Grid
        ref={ref}
        shareId={null}
        editable={true}
        filter={{ search }}
      />
    </ContentPage>
  )
}
