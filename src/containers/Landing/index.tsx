'use client'

import { getPathname, LanguageEnums, useRouter } from '@i18n/routing'
import Dropdown, { DropdownSkin } from '@components/Dropdown'
import Button, { ButtonSkin } from '@components/Button'
import SVGGoogle from '@public/svg/painted/google.svg'
import SVGPresetNew from '@public/svg/preset_new.svg'
import ContentPage from '@containers/ContentPage'
import ButtonPWA from '@containers/ButtonPWA'
import {useTranslations} from 'next-intl'
import {useSelector} from 'react-redux'
import {signIn} from 'next-auth/react'
import { preload } from 'react-dom'
import { Session } from 'next-auth'
import { memo } from 'react'
import clsx from 'clsx'

function Landing(
  {
    locale,
    mainScreenSRC
  }:
  {
    locale: LanguageEnums
    mainScreenSRC: string
  }
) {
  const session = useSelector(({ session }: { session: Session | null }) => session)

  const route = useRouter()
  preload(mainScreenSRC, { as: 'image', fetchPriority: 'high' })

  const appName = 'QuizerPlay'

  const t = useTranslations('Landing')

  const localeDropdownList = [
    { id: LanguageEnums.EN, name: 'English', href: getPathname({ href: '/', locale: LanguageEnums.EN }) },
    { id: LanguageEnums.RU, name: 'Русский', href: getPathname({ href: '/', locale: LanguageEnums.RU }) },
  ]

  const localeDropdownValue = localeDropdownList.find(({ id }) => id === locale)

  return (
    <ContentPage
      showHeader
      rightControls={(
        <ButtonPWA
          textInstall={t('pwa_install')}
          className="px-6 gap-2 font-medium text-nowrap w-full"
        />
      )}
    >
      <header
        className={clsx('relative bg-cover bg-fixed', {
          ['h-[calc(var(--vh)*100-4rem)]']: true
        })}
        style={{
          backgroundImage: `url('${mainScreenSRC}')`,
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="absolute top-4 right-4">
            <Dropdown
              caret
              className="py-1 px-2"
              skin={DropdownSkin.gray}
              items={localeDropdownList}
            >
              <span className="pr-2">
                {localeDropdownValue?.name || 'Language'}
              </span>
            </Dropdown>
          </div>

          <div
            className="absolute top-4 left-4 text-gray-100 bg-white/20 text-xs font-bold px-4 py-1 rounded-full mt-[2px] uppercase"
          >
            Beta
          </div>

          {session &&
            <div className="flex flex-col gap-16 text-center text-white px-6 max-w-[900px]">
              <div className="max-w-2xl text-gray-300">
                {t('helpSection1Title')}
              </div>

              <div className="flex justify-center">
                <Button
                  skin={ButtonSkin.WHITE}
                  onClick={() => route.push('/private/collection')}
                  className="px-6 gap-2 font-medium text-nowrap"
                >
                  <SVGPresetNew
                    width={28}
                    heught={28}
                    className="text-gray-800"
                  />
                  {t('mainButtonGoTo')}
                </Button>
              </div>
            </div>
          }

          {!session &&
            <div className="flex flex-col text-center text-white px-6 max-w-[900px]">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-12">
                {t('mainTitle')}
              </h1>
              <p
                className="text-lg md:text-xl mb-12"
                dangerouslySetInnerHTML={{__html: t('mainDesc')}}
              />

              <div className="flex flex-col gap-4 justify-center items-center">
                <Button
                  skin={ButtonSkin.WHITE}
                  onClick={async () => {
                    await signIn('google', {
                      redirect: true,
                      redirectTo: getPathname({href: '/private/collection', locale})
                    })
                  }}
                  className="px-6 gap-2 font-medium text-nowrap"
                >
                  <SVGGoogle
                    width={24}
                    height={24}
                  />
                  {t('mainButtonSignIn')}
                </Button>
              </div>
            </div>
          }
        </div>
      </header>

      {!session &&
        <>
          <section id="features" className="py-20 bg-white text-gray-700">
            <div className="flex flex-col items-center max-w-6xl mx-auto px-6">
              <h2
                className="text-3xl md:text-4xl font-bold text-center mb-12 max-w-[320px] md:max-w-full">
                {t('section1Title', {appName})}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="p-6 bg-gray-50 shadow-md rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">{t('section1Block1Title')}</h3>
                  <p>{t('section1Block1Text')}</p>
                </div>
                <div className="p-6 bg-gray-50 shadow-md rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">{t('section1Block2Title')}</h3>
                  <p>{t('section1Block2Text')}</p>
                </div>
                <div className="p-6 bg-gray-50 shadow-md rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">{t('section1Block3Title')}</h3>
                  <p>{t('section1Block3Text')}</p>
                </div>
                <div className="p-6 bg-gray-50 shadow-md rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">{t('section1Block4Title')}</h3>
                  <p>{t('section1Block4Text')}</p>
                </div>
                <div className="p-6 bg-gray-50 shadow-md rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">{t('section1Block5Title')}</h3>
                  <p>{t('section1Block5Text')}</p>
                </div>
                <div className="p-6 bg-gray-50 shadow-md rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">{t('section1Block6Title')}</h3>
                  <p>{t('section1Block6Text')}</p>
                </div>
              </div>
            </div>
          </section>

          <section
            id="how-it-works"
            className="relative bg-fixed bg-cover"
            style={{
              backgroundImage: `url('/images/bg-how-it-works.avif')`,
              backgroundPosition: 'center'
            }}
          >
            <div className="bg-black bg-opacity-70 py-36 px-6">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                  {t('section2Title', {appName})}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-400">
                  <div
                    className="p-6 bg-gray-900/50 border border-gray-400/50 shadow-lg rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('section2Block1Title')}</h3>
                    <p>{t('section2Block1Text')}</p>
                  </div>
                  <div
                    className="p-6 bg-gray-900/50 border border-gray-400/50 shadow-lg rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('section2Block2Title')}</h3>
                    <p>{t('section2Block2Text')}</p>
                  </div>
                  <div
                    className="p-6 bg-gray-900/50 border border-gray-400/50 shadow-lg rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('section2Block3Title')}</h3>
                    <p>{t('section2Block3Text')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="simulators" className="py-20 bg-white text-gray-700">
            <div className="flex flex-col items-center max-w-6xl mx-auto px-6">
              <h2
                className="text-3xl md:text-4xl font-bold text-center mb-12 max-w-[320px] md:max-w-full"
                dangerouslySetInnerHTML={{__html: t('section3Title', {appName})}}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-gray-50 shadow-md rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">{t('section3Block1Title')}</h3>
                  <p>{t('section3Block1Text')}</p>
                </div>

                <div className="p-6 bg-gray-50 shadow-md rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">{t('section3Block2Title')}</h3>
                  <p>{t('section3Block2Text')}</p>
                </div>

                <div className="p-6 bg-gray-50 shadow-md rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">{t('section3Block3Title')}</h3>
                  <p>{t('section3Block3Text')}</p>
                </div>
              </div>
            </div>
          </section>

          <section id="cta" className="py-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex flex-col items-center max-w-4xl mx-auto text-center px-6">
              <h2
                className="text-3xl md:text-4xl font-bold mb-8"
              >
                {t('section4Title', {appName})}
              </h2>
              <p className="text-lg md:text-xl mb-8 max-w-[600px]">
                {t('section4Text')}
              </p>

              <div className="flex justify-center gap-8">
                <Button
                  skin={ButtonSkin.WHITE}
                  className="px-6 gap-2 font-medium"
                  onClick={async () => {
                    await signIn('google', {
                      redirect: true,
                      redirectTo: getPathname({href: '/private/collection', locale})
                    })
                  }}
                >
                  <SVGGoogle
                    width={24}
                    height={24}
                  />
                  {t('section4ButtonSignIn')}
                </Button>
              </div>
            </div>
          </section>

          <footer className="bg-gray-900 text-gray-400 py-6">
            <div className="max-w-6xl mx-auto text-center">
              <p>{t('footer', {appName})}</p>
            </div>
          </footer>
        </>
      }
    </ContentPage>
  )
}

export default memo(Landing)
