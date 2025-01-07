import { generateMetaAlternates } from '@helper/meta'
import { getTranslations } from 'next-intl/server'
import { LanguageEnums } from '@i18n/constants'
import RelatedTerms from '@containers/RelatedTerms'
import React from 'react'

export async function generateMetadata({ params }: { params: Promise<{ locale: LanguageEnums, moduleId: string }>}) {
  const { locale, moduleId } = await params
  const t = await getTranslations({ locale, namespace: 'Terms' })

  return {
    title: t('metaTitle'),
    keywords: t('metaKeywords'),
    description: t('metaDescription'),
    alternates: generateMetaAlternates(locale, `private/modules/${moduleId}`)
  }
}

export default async function Page({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params

  return (
    <RelatedTerms
      editable={true}
      relation={{ moduleId }}
    />
  )
}
