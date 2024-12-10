import { ViewportEnums } from '@lib/viewport'
import { LanguageEnums } from '@i18n/routing'
import Landing from '@containers/Landing'

export default async function Page(
  {
    params,
    searchParams
  }:
  {
    params: Promise<{ locale: LanguageEnums }>
    searchParams: Promise<{ viewport: ViewportEnums }>
  }
) {
  const { locale } = await params
  const { viewport } = await searchParams

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
