import { generateMetaAlternates } from '@helper/meta'
import RelatedTerms from '@containers/RelatedTerms'
import { getTranslations } from 'next-intl/server'
import { LanguageEnums } from '@i18n/constants'
import React from 'react'

export async function generateMetadata({ params }: { params: Promise<{ locale: LanguageEnums, folderId: string }>}) {
  const { locale, folderId } = await params
  const t = await getTranslations({ locale, namespace: 'Terms' })

  return {
    title: t('metaTitle'),
    keywords: t('metaKeywords'),
    description: t('metaDescription'),
    alternates: generateMetaAlternates(locale, `private/folder/${folderId}`)
  }
}

export default async function Page({ params }: { params: Promise<{ folderId: string }> }) {
  const { folderId } = await params

  return (
    <RelatedTerms
      editable={true}
      relation={{ folderId }}
    />
  )
}
