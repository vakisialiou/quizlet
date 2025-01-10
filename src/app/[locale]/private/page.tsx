import { generateMetaAlternates } from '@helper/meta'
import { getTranslations } from 'next-intl/server'
import Collection from '@containers/Collection'
import { LanguageEnums } from '@i18n/constants'
import React from 'react'

export async function generateMetadata({ params }: { params: Promise<{ locale: LanguageEnums }>}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Modules' })

  return {
    title: t('metaTitle'),
    keywords: t('metaKeywords'),
    description: t('metaDescription'),
    alternates: generateMetaAlternates(locale, 'private')
  }
}

export default function Page() {
  return (
    <Collection />
  )
}
