'use client'

import { actionUpdateSimulator, actionUpdateModule } from '@store/index'
import { getPathname, LanguageEnums, useRouter } from '@i18n/routing'
import SimulatorBody from '@containers/Simulator/SimulatorBody'
import SVGRubyOutline from '@public/svg/ruby/ruby-outline.svg'
import { useSimulatorSelect } from '@hooks/useSimulatorSelect'
import { actionDeactivate } from '@helper/simulators/actions'
import { getModule, findSimulators } from '@helper/relation'
import DropdownLanguage from '@containers/DropdownLanguage'
import Button, { ButtonVariant } from '@components/Button'
import { useModuleSelect } from '@hooks/useModuleSelect'
import SVGGoogle from '@public/svg/painted/google.svg'
import SVGPresetNew from '@public/svg/preset_new.svg'
import FolderTitle from '@containers/FolderTitle'
import ContentPage from '@containers/ContentPage'
import Achievement from '@entities/Achievement'
import ButtonPWA from '@containers/ButtonPWA'
import { DEMO_MODULE_ID } from '@helper/demo'
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux'
import { signIn } from 'next-auth/react'
import { preload } from 'react-dom'
import { Session } from 'next-auth'
import React, { memo } from 'react'
import Image from 'next/image'
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
  const editable = false
  const relation = { moduleId: DEMO_MODULE_ID, folderId: null }
  const { relationSimulators, simulators } = useSimulatorSelect()
  const modules = useModuleSelect()

  const session = useSelector(({ session }: { session: Session | null }) => session)

  const route = useRouter()
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
            <DropdownLanguage
              locale={locale}
            />
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
                  variant={ButtonVariant.WHITE}
                  onClick={() => route.push('/private')}
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
            <div className="flex flex-col text-center text-gray-200 px-6 max-w-[900px]">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-12">
                {t('mainTitle')}
              </h1>
              <p
                className="text-base md:text-xl mb-12"
                dangerouslySetInnerHTML={{__html: t('mainDesc1')}}
              />

              <p
                className="text-xs md:text-sm mb-12 text-gray-500"
                dangerouslySetInnerHTML={{__html: t('mainDesc2')}}
              />

              <div className="flex flex-col gap-4 justify-center items-center">
                <Button
                  variant={ButtonVariant.WHITE}
                  onClick={async () => {
                    await signIn('google', {
                      redirect: true,
                      redirectTo: getPathname({href: '/private', locale})
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
          <section id="demo" className="bg-black">
            <div className="flex flex-col items-center max-w-6xl mx-auto py-20">
              <h2
                className="text-2xl md:text-3xl font-bold text-center mb-12 max-w-[320px] text-white/75"
              >
                <span dangerouslySetInnerHTML={{__html: t('section0Title')}}/>
              </h2>

              <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center gap-8">

                <div
                  className="px-[2px] md:px-2 py-4 flex flex-col items-center overflow-hidden gap-4 lg:order-2"
                >
                  <FolderTitle
                    relation={{ moduleId: DEMO_MODULE_ID }}
                    className="w-full max-w-96 items-center"
                  />

                  <SimulatorBody
                    editable={false}
                    relation={{ moduleId: DEMO_MODULE_ID }}
                    onDeactivateAction={(simulatorId) => {
                      const module = getModule(modules, DEMO_MODULE_ID)
                      if (!module) {
                        return
                      }

                      const moduleSimulators = findSimulators(relationSimulators, simulators, relation)
                      const updatedModule = { ...module, degreeRate: new Achievement().getRate(moduleSimulators) }

                      actionUpdateModule({ module: updatedModule, editable, editId: null }, () => {
                        const activeSimulator = moduleSimulators.find(({ id }) => simulatorId)
                        if (!activeSimulator) {
                          return
                        }
                        actionUpdateSimulator({ simulator: actionDeactivate(activeSimulator), editable })
                      })
                    }}
                  />
                </div>

                <div className="relative lg:order-1 flex flex-col items-center justify-center text-center">
                   <h4
                     className="lg:absolute lg:top-0 max-w-72 text-white/75 font-bold text-sm mb-8"
                     dangerouslySetInnerHTML={{__html: t('section2Head1')}}
                   />

                  <div
                    className="max-w-96 lg:scale-75 opacity-70 lg:border border-white/15 p-4"
                  >
                    <Image
                      width={360}
                      height={740}
                      alt={t('section2Alt1')}
                      src="/images/demo/terms.webp"
                    />
                  </div>
                </div>

                <div className="relative lg:order-3 flex flex-col items-center justify-center text-center">
                  <h4
                    className="lg:absolute lg:top-0 max-w-72 text-white/75 font-bold text-sm mb-8"
                    dangerouslySetInnerHTML={{ __html: t('section2Head2') }}
                  />

                  <div
                    className="max-w-96 lg:scale-75 opacity-70 lg:border border-white/15 p-4"
                  >
                    <Image
                      width={360}
                      height={740}
                      alt={t('section2Alt2')}
                      src="/images/demo/collections.webp"
                    />
                  </div>
                </div>

              </div>

              <div className="flex flex-col gap-2 max-w-[320px] mt-8 text-center">
                <h4 className="text-sm md:text-base text-white/75">
                  {t('section0Block2Title')}
                </h4>
                <p className="text-xs md:text-xs text-white/50 mt-4">
                  {t('section0Block2Text')}
                </p>

                <Button
                  variant={ButtonVariant.WHITE}
                  onClick={async () => {
                    await signIn('google', {
                      redirect: true,
                      redirectTo: getPathname({href: '/private', locale})
                    })
                  }}
                  className="px-6 gap-2 font-medium text-nowrap"
                >
                  <SVGGoogle
                    width={24}
                    height={24}
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
                    await signIn('google', {
                      redirect: true,
                      redirectTo: getPathname({href: '/private', locale})
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
