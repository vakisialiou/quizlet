import { routing, LanguageEnums } from '@i18n/routing'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import localFont from 'next/font/local'
import { SessionProvider } from 'next-auth/react'
import ProviderResize from './provider-resize'
import ProviderWorker from './provider-worker'
import ProviderOnline from './provider-online'

import React from 'react'
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
  const {locale} = await params
  if (!routing.locales.includes(locale)) {
    notFound()
  }

  const messages = await getMessages({ locale })

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
              {children}
            </SessionProvider>
          </ProviderResize>
        </ProviderWorker>
      </ProviderOnline>

    </NextIntlClientProvider>
    </body>
    </html>
  )
}
