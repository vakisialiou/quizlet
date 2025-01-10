import { generateMetaAlternates } from '@helper/meta'
import { getTranslations } from 'next-intl/server'
import { LanguageEnums } from '@i18n/constants'
import Module from '@containers/Module'
import React from 'react'

export async function generateMetadata({ params }: { params: Promise<{ locale: LanguageEnums, moduleId: string }>}) {
  const { locale, moduleId } = await params
  const t = await getTranslations({ locale, namespace: 'Module' })

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
    <Module
      editable={true}
      relation={{ moduleId }}
    />
  )
}
