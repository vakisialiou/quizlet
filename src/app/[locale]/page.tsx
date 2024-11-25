import { LanguageEnums } from '@i18n/routing'
import Landing from '@containers/Landing'

export default async function Page({ params }: { params: Promise<{ locale: LanguageEnums }> }) {
  const { locale } = await params

  return (
    <Landing locale={locale} />
  )
}
