import { generateMetaAlternates } from '@helper/meta'
import { LanguageEnums } from '@i18n/constants'
import Offline from '@containers/Offline'

export async function generateMetadata({ params }: { params: Promise<{ locale: LanguageEnums }>}) {
  const { locale } = await params
  return {
    alternates: generateMetaAlternates(locale, 'offline')
  }
}

export default function Page() {
  return (
    <Offline
      className="fixed left-0 top-0 h-full w-full"
    />
  )
}
