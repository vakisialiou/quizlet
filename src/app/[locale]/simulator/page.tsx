import { generateMetaAlternates } from '@helper/meta'
import { getTranslations } from 'next-intl/server'
import { LanguageEnums } from '@i18n/constants'
import Simulator from '@containers/Simulator'
import React from 'react'

export async function generateMetadata(
  {
    params,
    searchParams
  }:
  {
    params: Promise<{ locale: LanguageEnums }>,
    searchParams: Promise<Record<string, string | undefined>>
  }
) {
  const { locale } = await params
  const { moduleId, folderId } = (await searchParams)
  const t = await getTranslations({ locale, namespace: 'Simulators' })

  return {
    title: t('metaTitle'),
    keywords: t('metaKeywords'),
    description: t('metaDescription'),
    alternates: moduleId
      ? generateMetaAlternates(locale, `simulator?moduleId=${moduleId}`)
      : generateMetaAlternates(locale, `simulator?folderId=${folderId}`)
  }
}

export default async function Page(
  {
    searchParams
  }:
  {
    searchParams: Promise<Record<string, string | undefined>>
  }
) {
  const { moduleId, folderId } = (await searchParams)

  return (
    <Simulator
      editable={true}
      relation={{
        moduleId: moduleId || null,
        folderId: !moduleId ? folderId || null : null
      }}
    />
  )
}
