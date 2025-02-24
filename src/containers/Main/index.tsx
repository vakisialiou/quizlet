'use client'

import { useMainSelector } from '@hooks/useMainSelector'
import Collection from '@containers/Collection'
import { LanguageEnums } from '@i18n/constants'
import { ViewportEnums } from '@lib/viewport'
import Landing from '@containers/Landing'

export default function Main(
  {
    isExt,
    locale,
    viewport
  }:
  {
    isExt: boolean
    locale: LanguageEnums
    viewport: ViewportEnums
  }
) {
  const session = useMainSelector(({ session }) => session)
  if (session) {
    return (<Collection />)
  }

  return (
    <Landing
      isExt={isExt}
      locale={locale}
      mainScreenSRC={
        viewport === ViewportEnums.mobile
          ? '/images/720x450.webp'
          : '/images/1280x800.webp'
      }
    />
  )
}
