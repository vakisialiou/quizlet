'use client'


import Button, {ButtonVariant} from '@components/Button'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import {useMainSelector} from '@hooks/useMainSelector'
import SVGNewPreset from '@public/svg/preset_new.svg'
import Modules from '@containers/Collection/Modules'
import FilterModule from '@containers/FilterModule'
import ContentPage from '@containers/ContentPage'
import {useTranslations} from 'next-intl'
import {useRouter} from '@i18n/routing'
import React, {useState} from 'react'
import Module from '@entities/Module'

export default function Collection() {
  const editable = true
  const t = useTranslations('Modules')
  const edit = useMainSelector(({ edit }) => edit)
  const settings = useMainSelector(({ settings }) => settings)
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
          <Button
            disabled={!editable}
            variant={ButtonVariant.WHITE}
            className="gap-2 w-full max-w-96"
            onClick={() => {
              const course = new Module().serialize()
              router.push(`/private/modules/${course.id}`)
            }}
          >
            <SVGNewPreset
              width={28}
              height={28}
            />

            {t('btnCreateModule')}
          </Button>
        </div>
      )}
    >
      <FilterModule
        editable={editable}
        className="mb-4 mt-2"
      />

      <Modules
        options={{
          search,
          limit: Infinity,
          order: settings.modules.order,
          filter: settings.modules.filter
        }}
        editable={editable}
        editId={edit.moduleId}
      />
    </ContentPage>
  )
}
