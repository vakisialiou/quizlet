import { generateMetaAlternates } from '@helper/meta'
import { getTranslations } from 'next-intl/server'
import { LanguageEnums } from '@i18n/constants'
import Folder from '@containers/Folder'
import React from 'react'

export async function generateMetadata({ params }: { params: Promise<{ locale: LanguageEnums, folderId: string }>}) {
  const { locale, folderId } = await params
  const t = await getTranslations({ locale, namespace: 'Folder' })

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
    <Folder
      editable={true}
      relation={{ folderId }}
    />
  )
}
