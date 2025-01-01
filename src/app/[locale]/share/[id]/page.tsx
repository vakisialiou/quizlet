import { getFolderShareById } from '@repositories/folder-share'
import { generateMetaAlternates } from '@helper/meta'
import { getTranslations } from 'next-intl/server'
import { LanguageEnums } from '@i18n/routing'
import { prisma } from '@lib/prisma'

export async function generateMetadata({ params }: { params: Promise<{ locale: LanguageEnums }>}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Share' })
  return {
    title: t('metaTitle'),
    keywords: t('metaKeywords'),
    description: t('metaDescription'),
    alternates: generateMetaAlternates(locale)
  }
}

export default async function Page(
  {
    params,
  }:
    {
      params: Promise<{ id: string }>
    }
) {
  const { id } = await params
  const data = await getFolderShareById(prisma, id)
  console.log(data)


  return (
    <div

    >
      asdasd
    </div>
  )
}
