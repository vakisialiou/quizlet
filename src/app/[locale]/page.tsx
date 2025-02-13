import { generateMetaAlternates } from '@helper/meta'
import { getTranslations } from 'next-intl/server'
import { ViewportEnums } from '@lib/viewport'
import { LanguageEnums } from '@i18n/routing'
import { headers } from 'next/headers'
import Main from '@containers/Main'

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
    searchParams
  }:
  {
    params: Promise<{ locale: LanguageEnums }>,
    searchParams: Promise<{ [key: string]: string }>
  }
) {
  const { locale } = await params
  const { ext } = await searchParams
  const headerList = await headers()
  const viewport = headerList.get('x-viewport') as ViewportEnums

  return (
    <Main
      locale={locale}
      viewport={viewport}
      isExt={ext === '1'}
    />
  )
}
