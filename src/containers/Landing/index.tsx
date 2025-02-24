'use client'

import { getPathname, LanguageEnums } from '@i18n/routing'
import SimulatorBody from '@containers/Simulator/SimulatorBody'
import SVGRubyOutline from '@public/svg/ruby/ruby-outline.svg'
import { actionDeactivate } from '@helper/simulators/actions'
import { getSimulatorById } from '@helper/simulators/general'
import DropdownLanguage from '@containers/DropdownLanguage'
import Button, { ButtonVariant } from '@components/Button'
import { actionUpdateSimulator } from '@store/action-main'
import { useMainSelector } from '@hooks/useMainSelector'
import SVGGoogle from '@public/svg/painted/google.svg'
import SVGChrome from '@public/svg/painted/chrome.svg'
import ContentPage from '@containers/ContentPage'
import ButtonPWA from '@containers/ButtonPWA'
import { DEMO_MODULE_ID } from '@helper/demo'
import { useTranslations } from 'next-intl'
import { signIn } from 'next-auth/react'
import { preload } from 'react-dom'
import React, { memo } from 'react'
import Image from 'next/image'
import { ym } from '@lib/ym'
import clsx from 'clsx'
function Landing(
  {
    isExt,
    locale,
    mainScreenSRC
  }:
  {
    isExt: boolean
    locale: LanguageEnums
    mainScreenSRC: string
  }
) {
  const simulators = useMainSelector(({ simulators }) => simulators)

  preload(mainScreenSRC, { as: 'image', fetchPriority: 'high' })

  const appName = 'QuizerPlay'

  const t = useTranslations('Landing')

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
        style={{ backgroundImage: `url('${mainScreenSRC}')` }}
        className={clsx('relative bg-contain md:bg-cover bg-fixed bg-[center_120px] md:bg-center bg-no-repeat', {
          ['h-[calc(var(--vh)*100-4rem)]']: true
        })}
      >
        <div className="absolute w-full h-full backdrop-blur bg-gray-900/20 opacity-60"/>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute top-4 right-4">
            <DropdownLanguage
              locale={locale}
            />
          </div>

          <div
            className="absolute top-4 left-4 text-gray-100 bg-white/20 text-xs font-bold px-4 py-1 rounded-full mt-[2px] uppercase"
          >
            Beta
          </div>

          <div
            className="relative flex flex-col items-center text-center text-gray-200 px-6 pt-[100px] md:pt-0 max-w-[600px]">

            <h1
              className="text-4xl md:text-6xl font-bold leading-tight mb-12"
              dangerouslySetInnerHTML={{__html: t('mainTitle')}}
            />
            <h2
              className="text-base md:text-xl mb-12"
              dangerouslySetInnerHTML={{__html: t('mainDesc1')}}
            />

            <div className="flex flex-col gap-2 justify-center items-center w-72">
              <p
                className="text-xs md:text-sm text-white/80 font-medium w-full"
                dangerouslySetInnerHTML={{__html: t('mainDesc2')}}
              />

              <Button
                variant={ButtonVariant.WHITE}
                onClick={async () => {
                  ym(99899620, 'reachGoal', 'sign-in-1')
                  await signIn('google', {
                    redirect: true,
                    redirectTo: getPathname({href: '/', locale})
                  })
                }}
                className="px-6 gap-2 font-medium text-nowrap w-full mb-12"
              >
                <SVGGoogle
                  width={18}
                  height={18}
                />
                {t('mainButtonSignIn')}
              </Button>

              {!isExt &&
                <>
                  <p
                    className="text-xs md:text-sm text-white/80 font-medium w-full"
                    dangerouslySetInnerHTML={{__html: t('mainDesc3')}}
                  />

                  <a
                    href="https://chromewebstore.google.com/detail/quizerplay/cnenffadcgbjjeihcjecbbpgkfhnjljj"
                    className="w-full"
                    onClick={() => {
                      ym(99899620, 'reachGoal', 'ext-store-1')
                    }}
                  >
                    <Button
                      variant={ButtonVariant.GREEN}
                      className="px-4 gap-2 font-medium text-nowrap w-full"
                    >
                      <SVGChrome
                        width={18}
                        height={18}
                      />
                      {t('mainButtonChromeExt')}
                    </Button>
                  </a>
                </>
              }
            </div>
          </div>

        </div>
      </header>

      <>
        <section id="demo" className="bg-black">
        <div className="flex flex-col items-center max-w-6xl mx-auto py-20">
            <h2
              className="text-2xl md:text-3xl font-bold text-center mb-12 max-w-[320px] text-white/75"
            >
              <span dangerouslySetInnerHTML={{__html: t('section0Title')}}/>
            </h2>

            <div
              className="flex flex-col lg:flex-row items-center lg:items-end justify-center gap-8">

              <div
                className="px-4 py-4 flex flex-col items-center overflow-hidden gap-4 border border-white/15 rounded-md"
              >
                <SimulatorBody
                  editable={false}
                  relation={{moduleId: DEMO_MODULE_ID}}
                  onDeactivateAction={(simulatorId) => {
                    const activeSimulator = getSimulatorById(simulators, simulatorId)
                    if (activeSimulator) {
                      actionUpdateSimulator({
                        simulator: actionDeactivate(activeSimulator),
                        editable:false
                      })
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="preview-1"
          className="py-20 bg-white text-black"
        >
          <div
            className="flex flex-col gap-8 items-center justify-center text-center">
            <h2
              className="max-w-96 text-black font-bold text-xl px-4"
              dangerouslySetInnerHTML={{__html: t('section2Head1')}}
            />

            <div
              className="max-w-96 lg:border border-black/15 p-4 rounded-md"
            >
              <Image
                width={360}
                height={740}
                alt={t('section2Alt1')}
                src="/images/demo/cards.webp"
              />
            </div>
          </div>
        </section>

        <section
          id="preview-2"
          className="py-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white"
        >
          <div
            className="flex flex-col gap-8 items-center justify-center text-center"
          >
            <h2
              className="max-w-96 text-white font-bold text-xl px-4"
              dangerouslySetInnerHTML={{__html: t('section2Head2')}}
            />

            <div
              className="max-w-96 lg:border border-white/15 p-4 rounded-md"
            >
              <Image
                width={360}
                height={740}
                alt={t('section2Alt2')}
                src="/images/demo/sections.webp"
              />
            </div>

            <div className="flex flex-col gap-2 max-w-[320px] text-center">
              <h4
                className="text-sm md:text-base text-white"
                dangerouslySetInnerHTML={{ __html: t('section0Block2Title') }}
              />
              <p
                className="text-xs font-bold text-white mt-4"
                dangerouslySetInnerHTML={{ __html: t('section0Block2Text') }}
              />

              <Button
                variant={ButtonVariant.WHITE}
                onClick={async () => {
                  ym(99899620,'reachGoal','sign-in-2')
                  await signIn('google', {
                    redirect: true,
                    redirectTo: getPathname({href: '/', locale})
                  })
                }}
                className="px-6 gap-2 font-medium text-nowrap"
              >
                <SVGGoogle
                  width={18}
                  height={18}
                />
                {t('section0ButtonSignIn')}
              </Button>
            </div>
          </div>

        </section>

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

            {!isExt &&
              <div
                className="flex flex-col gap-2 w-72 mt-12 text-center"
              >
                <p
                  className="text-xs text-black/50 font-medium w-full"
                  dangerouslySetInnerHTML={{__html: t('mainDesc3')}}
                />

                <a
                  className="w-full"
                  onClick={() => {
                    ym(99899620,'reachGoal','ext-store-2')
                  }}
                  href="https://chromewebstore.google.com/detail/quizerplay/cnenffadcgbjjeihcjecbbpgkfhnjljj"
                >
                  <Button
                    variant={ButtonVariant.GREEN}
                    className="px-4 gap-2 font-medium text-nowrap w-full"
                  >
                    <SVGChrome
                      width={18}
                      height={18}
                    />
                    {t('mainButtonChromeExt')}
                  </Button>
                </a>
              </div>
            }
          </div>
        </section>

        <section
          id="how-it-works"
          className="relative bg-fixed bg-cover"
          style={{
            backgroundImage: `url('${mainScreenSRC}')`,
            backgroundPosition: 'center'
          }}
        >
          <div className="bg-black bg-opacity-70 py-36 px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                {t('section2Title')}
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
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-semibold">{t('section3Block1Title')}</h3>
                    <SVGRubyOutline
                      width={24}
                      height={24}
                      className="text-amber-600"
                    />
                  </div>
                  <p>{t('section3Block1Text')}</p>
                </div>

                <div className="p-6 bg-gray-50 shadow-md rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-semibold">{t('section3Block2Title')}</h3>
                    <SVGRubyOutline
                      width={24}
                      height={24}
                      className="text-amber-600"
                    />
                  </div>
                  <p>{t('section3Block2Text')}</p>
                </div>

                <div className="p-6 bg-gray-50 shadow-md rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-semibold">{t('section3Block3Title')}</h3>
                    <SVGRubyOutline
                      width={24}
                      height={24}
                      className="text-amber-600"
                    />
                  </div>
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
                  variant={ButtonVariant.WHITE}
                  className="px-6 gap-2 font-medium"
                  onClick={async () => {
                    ym(99899620,'reachGoal','sign-in-3')
                    await signIn('google', {
                      redirect: true,
                      redirectTo: getPathname({href: '/', locale})
                    })
                  }}
                >
                  <SVGGoogle
                    width={18}
                    height={18}
                  />
                  {t('section4ButtonSignIn')}
                </Button>
              </div>
            </div>
          </section>

        <footer className="flex items-center justify-between gap-2 bg-gray-900 text-gray-400 p-4">
          <p className="text-center text-sm">{t('footer', {appName})}</p>
          <a
            href={`https://webmaster.yandex.ru/siteinfo/?site=https://quizerplay.com/${locale}`}
            className="min-w-[88px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              width="88"
              height="31"
              alt=""
              border-radius="8"
              className="rounded-md"
              src={`https://yandex.ru/cycounter?https://quizerplay.com&theme=dark&lang=${locale}`}
            />
          </a>
        </footer>
      </>
    </ContentPage>
  )
}

export default memo(Landing)
