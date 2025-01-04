import { generateMetaAlternates } from '@helper/meta'
import { getTranslations } from 'next-intl/server'
import { LanguageEnums } from '@i18n/constants'
import Simulator from '@containers/Simulator'
import React from 'react'

export async function generateMetadata({ params }: { params: Promise<{ locale: LanguageEnums, folderId: string }>}) {
  const { locale, folderId } = await params
  const t = await getTranslations({ locale, namespace: 'Simulators' })

  return {
    title: t('metaTitle'),
    keywords: t('metaKeywords'),
    description: t('metaDescription'),
    alternates: generateMetaAlternates(locale, `private/simulator/${folderId}`)
  }
}

export default async function Page({ params }: { params: Promise<{ folderId: string }> }) {
  const { folderId } = await params
  return (
    <Simulator
      editable={true}
      folderId={folderId}
    />
  )
}
