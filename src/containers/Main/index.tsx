'use client'

import Collection from '@containers/Collection'
import { LanguageEnums } from '@i18n/constants'
import { ViewportEnums } from '@lib/viewport'
import Landing from '@containers/Landing'
import { useSelector } from 'react-redux'
import { Session } from 'next-auth'

export default function Main(
  {
    locale,
    viewport
  }:
  {
    locale: LanguageEnums,
    viewport: ViewportEnums
  }
) {
  const session = useSelector(({ session }: { session: Session | null }) => session)
  if (session) {
    return (<Collection />)
  }

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
