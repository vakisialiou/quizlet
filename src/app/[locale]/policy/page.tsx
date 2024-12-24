import { generateMetaAlternates } from '@helper/meta'
import { getTranslations } from 'next-intl/server'
import { LanguageEnums } from '@i18n/constants'
import Policy from '@containers/Policy'

export async function generateMetadata({ params }: { params: Promise<{ locale: LanguageEnums }>}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Policy' })

  return {
    title: t('metaTitle'),
    keywords: t('metaKeywords'),
    description: t('metaDescription'),
    alternates: generateMetaAlternates(locale, 'policy')
  }
}

export default function Page() {
  return (
    <Policy />
  )
}
