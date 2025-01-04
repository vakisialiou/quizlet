import { generateMetaAlternates } from '@helper/meta'
import { getTranslations } from 'next-intl/server'
import { LanguageEnums } from '@i18n/constants'
import Terms from '@containers/Terms'
import React from 'react'

export async function generateMetadata({ params }: { params: Promise<{ locale: LanguageEnums, id: string }>}) {
  const { locale, id } = await params
  const t = await getTranslations({ locale, namespace: 'Terms' })

  return {
    title: t('metaTitle'),
    keywords: t('metaKeywords'),
    description: t('metaDescription'),
    alternates: generateMetaAlternates(locale, `private/folder/${id}`)
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <Terms
      folderId={id}
    />
  )
}
