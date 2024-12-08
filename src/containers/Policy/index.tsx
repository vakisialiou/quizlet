'use client'

import ContentPage from '@containers/ContentPage'
import {useTranslations} from 'next-intl'

export default function Policy() {
  const appName = 'QuizerPlay'
  const email = 'v.a.kiselyov@gmail.com'
  const t = useTranslations('Policy')

  return (
    <ContentPage
      showHeader
    >
      <div className="w-full flex justify-center box-content">
        <div className="flex flex-col bg-gray-900/50 max-w-screen-lg px-6 py-6 md:px-12">
          <h1 className="text-xl font-bold mb-4">
            {t('title')}
          </h1>

          <h5 className="text-lg text-gray-600 mb-4">
            {t('titleUpdate', { date: '1 декабря 2024' })}
          </h5>

          <p className="text-base mb-4">
            {t('section1Text', { appName })}
          </p>
          <p className="text-base mb-4">
            {t('section2Text', { appName })}
          </p>

          <h6 className="text-xl font-semibold mt-6 mb-2">
            {t('section3Title')}
          </h6>
          <p className="text-base mb-4">
            {t('section3Text')}
          </p>

          <ul className="list-disc pl-6 mb-4">
            <li dangerouslySetInnerHTML={{__html: t('section3Item1')}}/>
            <li dangerouslySetInnerHTML={{__html: t('section3Item2')}}/>
            <li dangerouslySetInnerHTML={{__html: t('section3Item3')}}/>
          </ul>

          <h6 className="text-xl font-semibold mt-6 mb-2">
            {t('section4Title')}
          </h6>
          <p className="text-base mb-4">
            {t('section4Text')}
          </p>

          <ul className="list-disc pl-6 mb-4">
            <li dangerouslySetInnerHTML={{__html: t('section4Item1')}}/>
            <li dangerouslySetInnerHTML={{__html: t('section4Item2')}}/>
            <li dangerouslySetInnerHTML={{__html: t('section4Item3')}}/>
            <li dangerouslySetInnerHTML={{__html: t('section4Item4')}}/>
          </ul>

          <h6 className="text-xl font-semibold mt-6 mb-2">
            {t('section5Title')}
          </h6>
          <p className="text-base mb-4">
            {t('section5Text')}
          </p>

          <ul className="list-disc pl-6 mb-4">
            <li dangerouslySetInnerHTML={{__html: t('section5Item1')}}/>
            <li dangerouslySetInnerHTML={{__html: t('section5Item2')}}/>
          </ul>

          <h6 className="text-xl font-semibold mt-6 mb-2">
            {t('section6Title')}
          </h6>
          <p className="text-base mb-4">
            {t('section6Text')}
          </p>

          <ul className="list-disc pl-6 mb-4">
            <li dangerouslySetInnerHTML={{__html: t('section6Item1')}}/>
            <li dangerouslySetInnerHTML={{__html: t('section6Item2')}}/>
          </ul>

          <h6 className="text-xl font-semibold mt-6 mb-2">
            {t('section7Title')}
          </h6>
          <p className="text-base mb-4">
            {t('section7Text1')}
          </p>

          <ul className="list-disc pl-6 mb-4">
            <li dangerouslySetInnerHTML={{__html: t('section7Item1')}}/>
            <li dangerouslySetInnerHTML={{__html: t('section7Item2')}}/>
            <li dangerouslySetInnerHTML={{__html: t('section7Item3')}}/>
          </ul>

          <p className="text-base mb-4">
            {t('section7Text2')}
          </p>

          <h6 className="text-xl font-semibold mt-6 mb-2">
            {t('section8Title')}
          </h6>
          <p className="text-base mb-4">
            {t('section8Text1')}
          </p>

          <ul className="list-disc pl-6 mb-4">
            <li dangerouslySetInnerHTML={{__html: t('section8Item1')}}/>
          </ul>

          <p className="text-base mb-4">
            {t('section8Text2', { email })}
          </p>

          <h6 className="text-xl font-semibold mt-6 mb-2">
            {t('section9Title')}
          </h6>
          <p className="text-base mb-4">
            {t('section9Text')}
          </p>

          <h6 className="text-xl font-semibold mt-6 mb-2">
            {t('section10Title')}
          </h6>
          <p className="text-base mb-4">
            {t('section10Text')}
          </p>

          <h6 className="text-xl font-semibold mt-6 mb-2">
            {t('section11Title')}
          </h6>
          <p className="text-base mb-4">
            {t('section11Text', { email })}
          </p>

        </div>
      </div>
    </ContentPage>
  )
}
