'use client'

import Button, { ButtonVariant } from '@components/Button'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import SVGNewPreset from '@public/svg/preset_new.svg'
import { ConfigEditType } from '@store/initial-state'
import Modules from '@containers/Collection/Modules'
import ButtonSquare from '@components/ButtonSquare'
import ContentPage from '@containers/ContentPage'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import { useRouter } from '@i18n/routing'
import { useSelector } from 'react-redux'
import React, { useState } from 'react'
import Module from '@entities/Module'

export default function Collection() {
  const editable = true
  const t = useTranslations('Modules')
  const edit = useSelector(({ edit }: { edit: ConfigEditType }) => edit)
  const [search, setSearch] = useState<string>('')

  const router = useRouter()

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
            onClear: () => setSearch(''),
            placeholder: t('searchPlaceholder'),
            onChange: ({ formattedValue }) => setSearch(formattedValue)
          }}
        />
      )}
      footer={(
        <div className="flex w-full justify-center text-center">
          <div className="flex gap-2 w-full max-w-96">
            <Button
              disabled={!editable}
              variant={ButtonVariant.WHITE}
              className="w-full"
              onClick={() => {
                const module = new Module().serialize()
                router.push(`/private/modules/${module.id}`)
              }}
            >
              <SVGNewPreset
                width={28}
                height={28}
              />

              {t('footButtonCreateModule')}
            </Button>
          </div>
        </div>
      )}
      rightControls={(
        <>
          <ButtonSquare
            icon={SVGBack}
            onClick={() => {
              router.push(`/`)
            }}
          />
        </>
      )}
    >
      <Modules
        filter={{ search }}
        editable={editable}
        editId={edit.moduleId}
      />
    </ContentPage>
  )
}
