import { getDemoFoldersInitialData } from '@helper/demo'
import ProviderStore from '@app/[locale]/provider-store'
import { getInitialState } from '@store/initial-state'
import { generateMetaAlternates } from '@helper/meta'
import { getTranslations } from 'next-intl/server'
import { ViewportEnums } from '@lib/viewport'
import { LanguageEnums } from '@i18n/routing'
import Landing from '@containers/Landing'
import { headers } from 'next/headers'
import { auth } from '@auth'

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

  const session = await auth()
  const folders = await getDemoFoldersInitialData(locale)
  const initialState = await getInitialState({ session, folders })

  return (
    <ProviderStore initialState={initialState}>
      <Landing
        locale={locale}
        mainScreenSRC={
        viewport === ViewportEnums.mobile
          ? '/images/bg-head-1280x853.webp'
          : '/images/bg-head-3870x2580.avif'
        }
      />
    </ProviderStore>
  )
}
