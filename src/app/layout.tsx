import { createPreloadedSimulatorsState } from '@store/reducers/simulators'
import { createPreloadedFoldersState } from '@store/reducers/folders'
import { createPreloadedTermsState } from '@store/reducers/terms'
import { findFoldersByUserId } from '@repositories/folders'
import { findTermsByUserId } from '@repositories/terms'
import localFont from 'next/font/local'
import Header from '@containers/Header'
import ReduxProvider from './provider'
import type { Metadata } from 'next'
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
  title: 'Quizlet',
  description: 'Quizlet app',
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const folders = await findFoldersByUserId(1)
  const terms = await findTermsByUserId(1)

  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider
          preloadedState={{
            terms: createPreloadedTermsState(terms),
            folders: createPreloadedFoldersState(folders),
            simulators: createPreloadedSimulatorsState({})
          }}
        >
          <Header menuItems={[]} />

          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
