import { generateMetaAlternates } from '@helper/meta'
import { LanguageEnums } from '@i18n/constants'
import Policy from '@containers/Policy'

export async function generateMetadata({ params }: { params: Promise<{ locale: LanguageEnums }>}) {
  const { locale } = await params
  return {
    alternates: generateMetaAlternates(locale, 'policy')
  }
}

export default function Page() {
  return (
    <Policy />
  )
}
