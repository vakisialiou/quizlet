import { findRelationSimulatorsByUserId } from '@repositories/relation-simulator'
import { findRelationFoldersByUserId } from '@repositories/relation-folder'
import { findRelationTermsByUserId } from '@repositories/relation-term'
import { findModuleSharesByOwnerId } from '@repositories/module-share'
import { findFolderGroupsByUserId } from '@repositories/folder-group'
import { findSimulatorsByUserId } from '@repositories/simulators'
import { getInitialState } from '@store/initial-state-main'
import { findFoldersByUserId } from '@repositories/folders'
import { findModulesByUserId } from '@repositories/modules'
import ProviderStore from '@app/[locale]/provider-store'
import { findTermsByUserId } from '@repositories/terms'
import { routing, LanguageEnums } from '@i18n/routing'
import { getSettings } from '@repositories/settings'
import { NextIntlClientProvider } from 'next-intl'
import { getDemoInitialData } from '@helper/demo'
import { SessionProvider } from 'next-auth/react'
import ProviderResize from './provider-resize'
import ProviderWorker from './provider-worker'
import ProviderOnline from './provider-online'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import localFont from 'next/font/local'
import { prisma } from '@lib/prisma'
import Script from 'next/script'
import { auth } from '@auth'
import React from 'react'

import '@containers/Simulator/CardAggregator/MethodFlashcard/Flashcard/style.css'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export async function generateMetadata() {
  return {
    icons: [
      {rel: 'icon', type: 'image/png', sizes: '32x32', url: '/icons/favicon-32x32.png'},
      {rel: 'icon', type: 'image/png', sizes: '96x96', url: '/icons/favicon-96x96.png'},
      {rel: 'icon', type: 'image/png', sizes: '16x16', url: '/icons/favicon-16x16.png'},
      {rel: 'icon', type: 'image/png', sizes: '120x120', url: '/favicon.png'},
      {rel: 'apple-touch-icon', sizes: '57x57', url: '/icons/apple-icon-57x57.png'},
      {rel: 'apple-touch-icon', sizes: '60x60', url: '/icons/apple-icon-60x60.png'},
      {rel: 'apple-touch-icon', sizes: '72x72', url: '/icons/apple-icon-72x72.png'},
      {rel: 'apple-touch-icon', sizes: '76x76', url: '/icons/apple-icon-76x76.png'},
      {rel: 'apple-touch-icon', sizes: '114x114', url: '/icons/apple-icon-114x114.png'},
      {rel: 'apple-touch-icon', sizes: '120x120', url: '/icons/apple-icon-120x120.png'},
      {rel: 'apple-touch-icon', sizes: '144x144', url: '/icons/apple-icon-144x144.png'},
      {rel: 'apple-touch-icon', sizes: '152x152', url: '/icons/apple-icon-152x152.png'},
      {rel: 'apple-touch-icon', sizes: '180x180', url: '/icons/apple-icon-180x180.png'},
    ],
  }
}

export default async function RootLayout({
 children,
 params,
}:
 Readonly<{
   children: React.ReactNode,
   params: Promise<{ locale: LanguageEnums }>,
 }
>
) {
  const { locale } = await params
  if (!routing.locales.includes(locale)) {
    notFound()
  }

  async function createInitialState(locale: LanguageEnums) {
    const session = await auth()
    const userId = session?.user?.id || ''
    if (userId) {
      const [
        settings,
        terms,
        modules,
        folders,
        simulators,
        folderGroups,
        moduleShares,
        relationTerms,
        relationFolders,
        relationSimulators
      ] = await Promise.all([
        getSettings(prisma, userId),
        findTermsByUserId(prisma, userId),
        findModulesByUserId(prisma, userId),
        findFoldersByUserId(prisma, userId),
        findSimulatorsByUserId(prisma, userId),
        findFolderGroupsByUserId(prisma, userId),
        findModuleSharesByOwnerId(prisma, userId),
        findRelationTermsByUserId(prisma, userId),
        findRelationFoldersByUserId(prisma, userId),
        findRelationSimulatorsByUserId(prisma, userId),
      ])

      return await getInitialState({
        session,
        settings,
        terms,
        modules,
        folders,
        simulators,
        folderGroups,
        moduleShares,
        relationTerms,
        relationFolders,
        relationSimulators
      })
    }
    return getDemoInitialData(locale)
  }

  const messages = await getMessages({ locale })
  const initialState = await createInitialState(locale)

  return (
    <html lang={locale} translate="no">
    <body
      suppressHydrationWarning={true}
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-80 h-screen overflow-hidden`}
    >
    <Script
      id="yandex-metrika"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
           m[i].l=1*new Date();
           for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
           k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
           (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

           ym(99899620, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true
           });
        `
      }}
    />

    <Script
      strategy="afterInteractive"
      src="https://www.googletagmanager.com/gtag/js?id=G-KB120NBNK5"
    />

    <Script
      id="google-analytics"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-KB120NBNK5');
        `
      }}
    />

    <noscript>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://mc.yandex.ru/watch/99899620"
          style={{position: "absolute", left: "-9999px"}}
          alt=""
        />
      </div>
    </noscript>

    <NextIntlClientProvider locale={locale} messages={messages}>

      <ProviderOnline>
        <ProviderWorker>
          <ProviderResize>
            <SessionProvider>
              <ProviderStore initialState={initialState}>
                {children}
              </ProviderStore>
            </SessionProvider>
          </ProviderResize>
        </ProviderWorker>
      </ProviderOnline>

    </NextIntlClientProvider>
    </body>
    </html>
  )
}
