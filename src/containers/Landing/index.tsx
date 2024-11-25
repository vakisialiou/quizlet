'use client'

import Button, { ButtonSkin, ButtonSize } from '@components/Button'
import SVGGoogle from '@public/svg/painted/google.svg'
import ContentPage from '@containers/ContentPage'
import { useTranslations } from 'next-intl'
import { useRouter } from '@i18n/routing'
import { useSelector } from 'react-redux'
import { signIn } from 'next-auth/react'
import { Session } from 'next-auth'
import { memo } from 'react'
import clsx from 'clsx'

function Landing() {
  const route = useRouter()
  const session = useSelector(({ session }: { session: Session | null }) => session)

  const appName = 'QuizerPlay'

  const t = useTranslations('Landing')

  return (
    <ContentPage
      hideHeader={!session}
    >
      <header
        className={clsx('relative bg-cover bg-fixed', {
          ['h-[calc(100vh-4rem)]']: session,
          ['h-screen']: !session
        })}
        style={{
          backgroundImage: `url('/images/bg-head.avif')`,
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            className="absolute top-4 right-4 text-white bg-yellow-500 text-sm font-bold px-4 py-1 rounded-full"
          >
            Beta
          </div>

          {session &&
            <div className="flex flex-col text-center text-white px-6 max-w-[900px]">
              <div className="flex justify-center">
                <Button
                  size={ButtonSize.H12}
                  skin={ButtonSkin.WHITE_100}
                  onClick={() => route.push('/private')}
                  className="px-6 gap-2 font-medium text-nowrap"
                >
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

              <div className="flex justify-center">
                <Button
                  size={ButtonSize.H12}
                  skin={ButtonSkin.WHITE_100}
                  onClick={async () => await signIn('google')}
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
                  <div className="p-6 bg-gray-900/50 border border-gray-400/50 shadow-lg rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('section2Block1Title')}</h3>
                    <p>{t('section2Block1Text')}</p>
                  </div>
                  <div className="p-6 bg-gray-900/50 border border-gray-400/50 shadow-lg rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('section2Block2Title')}</h3>
                    <p>{t('section2Block2Text')}</p>
                  </div>
                  <div className="p-6 bg-gray-900/50 border border-gray-400/50 shadow-lg rounded-lg">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-gray-50 shadow-md rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">{t('section3Block1Title')}</h3>
                  <p>{t('section3Block1Text')}</p>
                </div>
                <div className="p-6 bg-gray-50 shadow-md rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">{t('section3Block2Title')}</h3>
                  <p>{t('section3Block2Text')}</p>
                </div>
              </div>
            </div>
          </section>

          <section id="cta" className="py-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex flex-col items-center max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">{t('section4Title', {appName})}</h2>
              <p className="text-lg md:text-xl mb-8 max-w-[600px]">{t('section4Text')}</p>

              <div className="flex justify-center gap-8">
                <Button
                  size={ButtonSize.H12}
                  skin={ButtonSkin.WHITE_100}
                  className="px-6 gap-2 font-medium"
                  onClick={async () => await signIn('google')}
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
