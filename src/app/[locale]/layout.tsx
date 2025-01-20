import { routing, LanguageEnums } from '@i18n/routing'
import { NextIntlClientProvider } from 'next-intl'
import { SessionProvider } from 'next-auth/react'
import ProviderResize from './provider-resize'
import ProviderWorker from './provider-worker'
import ProviderOnline from './provider-online'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import localFont from 'next/font/local'

import { findRelationSimulatorsByUserId } from '@repositories/relation-simulator'
import { findRelationFoldersByUserId } from '@repositories/relation-folder'
import { findRelationTermsByUserId } from '@repositories/relation-term'
import { findFolderGroupsByUserId } from '@repositories/folder-group'
import { findSimulatorsByUserId } from '@repositories/simulators'
import { findFoldersByUserId } from '@repositories/folders'
import { findModulesByUserId } from '@repositories/modules'
import { findTermsByUserId } from '@repositories/terms'
import ProviderStore from '@app/[locale]/provider-store'
import { getInitialState } from '@store/initial-state'
import { getSettings } from '@repositories/settings'
import { getDemoInitialData } from '@helper/demo'
import { prisma } from '@lib/prisma'
import { auth } from '@auth'
import React from 'react'
import './globals.css'
import {findModuleSharesByOwnerId} from "@repositories/module-share";

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
      return await getInitialState({
        session,
        settings: await getSettings(prisma, userId),
        terms: await findTermsByUserId(prisma, userId),
        modules: await findModulesByUserId(prisma, userId),
        folders: await findFoldersByUserId(prisma, userId),
        simulators: await findSimulatorsByUserId(prisma, userId),
        folderGroups: await findFolderGroupsByUserId(prisma, userId),
        moduleShares: await findModuleSharesByOwnerId(prisma, userId),
        relationTerms: await findRelationTermsByUserId(prisma, userId),
        relationFolders: await findRelationFoldersByUserId(prisma, userId),
        relationSimulators: await findRelationSimulatorsByUserId(prisma, userId)
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
