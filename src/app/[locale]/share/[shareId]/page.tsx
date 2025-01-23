import { generateMetaAlternates } from '@helper/meta'
import { getTranslations } from 'next-intl/server'
import { LanguageEnums } from '@i18n/routing'
import Share from './Share'

export async function generateMetadata({ params }: { params: Promise<{ locale: LanguageEnums, shareId: string }>}) {
  const { locale, shareId } = await params
  const t = await getTranslations({ locale, namespace: 'Share' })
  return {
    title: t('metaTitle'),
    keywords: t('metaKeywords'),
    description: t('metaDescription'),
    alternates: generateMetaAlternates(locale, `share/${shareId}`)
  }
}

export default async function Page() {
  return (
    <Share />
  )
}
