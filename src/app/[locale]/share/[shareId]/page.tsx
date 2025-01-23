import { generateMetaAlternates } from '@helper/meta'
import { getTranslations } from 'next-intl/server'
import { LanguageEnums } from '@i18n/routing'
import Share from './Share'

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

export default async function Page() {


  return (
    <Share />
  )
}
