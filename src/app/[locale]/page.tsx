import { generateMetaAlternates } from '@helper/meta'
import { getTranslations } from 'next-intl/server'
import { ViewportEnums } from '@lib/viewport'
import { LanguageEnums,  } from '@i18n/routing'
import { headers } from 'next/headers'
import Main from '@containers/Main'
import Script from 'next/script'

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

  const tl = await getTranslations({ locale, namespace: 'Landing' })
  const tn = await getTranslations({ locale, namespace: 'NavMenu' })
  return (
    <>
      <Main
        locale={locale}
        viewport={viewport}
        isExt={ext === '1'}
      />
      <Script
        id="schema-org"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          'name': tl('schemaOrgName'),
          'description': tl('schemaOrgDescription'),
          'url': `https://quizerplay.com/${locale}`,
          'breadcrumb': {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': tn('home'),
                'item': `https://quizerplay.com/${locale}`
              }
            ]
          },
          'primaryImageOfPage': {
            '@type': 'ImageObject',
            'contentUrl': 'https://quizerplay.com/images/1200x630.webp'
          }
        })}}
      />
    </>
  )
}
