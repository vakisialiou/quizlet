import { generateMetaAlternates } from '@helper/meta'
import { getTranslations } from 'next-intl/server'
import { ViewportEnums } from '@lib/viewport'
import { LanguageEnums } from '@i18n/routing'
import Landing from '@containers/Landing'
import { headers } from 'next/headers'

export async function generateMetadata({ params }: { params: Promise<{ locale: LanguageEnums }>}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Landing' })
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
    params: Promise<{ locale: LanguageEnums }>
  }
) {
  const { locale } = await params
  const headerList = await headers()
  const viewport = headerList.get('x-viewport') as ViewportEnums

  return (
    <Landing
      locale={locale}
      mainScreenSRC={
      viewport === ViewportEnums.mobile
        ? '/images/bg-head-1280x853.webp'
        : '/images/bg-head-3870x2580.avif'
      }
    />
  )
}
