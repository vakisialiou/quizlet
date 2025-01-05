'use client'

import { ModuleShareData, ModuleShareEnum } from '@entities/ModuleShare'
import Button, { ButtonVariant } from '@components/Button'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import SVGFileNew from '@public/svg/file_new.svg'
import ContentPage from '@containers/ContentPage'
import React, { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import Grid from '@containers/Terms/Grid'
import { useSelector } from 'react-redux'

export default function Share() {
  const share = useSelector(({ share }: { share: ModuleShareData }) => share)

  const [ search, setSearch ] = useState<string>('')

  const t = useTranslations('Terms')

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
                {t('footButtonCreateTerm')}
              </Button>
            </div>
          </div>
        </>
      )}
    >
      <Grid
        ref={ref}
        shareId={share.id}
        filter={{ search }}
        editable={editable}
        relation={{ moduleId: share.moduleId }}
      />
    </ContentPage>
  )
}
