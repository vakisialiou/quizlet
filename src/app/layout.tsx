import {getInitialState} from '@store/initial-state'
import {getSettings} from '@repositories/settings'
import {AppProvider} from '@app/provider'
import localFont from 'next/font/local'
import type { Metadata } from 'next'
import {auth} from '@auth'
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

export const metadata: Metadata = {
  title: 'QuizerPlay - Структурируйте знания, обучайтесь с симуляторами и карточками для запоминания',
  description: `Создавайте модули и карточки для эффективного обучения с симуляторами. Автоматические ассоциации и награды помогут вам учиться быстрее и достигать результатов.`,
  keywords: 'Quizlet альтернатива, обучение, симуляторы для запоминания, карточки для учебы, ассоциации AI, мотивация обучения, гибкость обучения, геймификация образования, эффективные симуляторы, AI-поддержка, лучшие методы запоминания',
  icons: [
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/icons/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '96x96', url: '/icons/favicon-96x96.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/icons/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '57x57', url: '/icons/apple-icon-57x57.png' },
    { rel: 'apple-touch-icon', sizes: '60x60', url: '/icons/apple-icon-60x60.png' },
    { rel: 'apple-touch-icon', sizes: '72x72', url: '/icons/apple-icon-72x72.png' },
    { rel: 'apple-touch-icon', sizes: '76x76', url: '/icons/apple-icon-76x76.png' },
    { rel: 'apple-touch-icon', sizes: '114x114', url: '/icons/apple-icon-114x114.png' },
    { rel: 'apple-touch-icon', sizes: '120x120', url: '/icons/apple-icon-120x120.png' },
    { rel: 'apple-touch-icon', sizes: '144x144', url: '/icons/apple-icon-144x144.png' },
    { rel: 'apple-touch-icon', sizes: '152x152', url: '/icons/apple-icon-152x152.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/icons/apple-icon-180x180.png' },
    { rel: 'manifest', url: '/icons/manifest.json' },
  ],
}

export default async function RootLayout({
 children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  const settings = await getSettings(session?.user?.id || '')
  const initialState = await getInitialState({session, settings})

  return (
    <html lang="ru">
    <body
      suppressHydrationWarning={true}
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-80 h-screen overflow-hidden`}
    >
    <AppProvider initialState={initialState}>
      {children}
    </AppProvider>
    </body>
    </html>
  )
}
