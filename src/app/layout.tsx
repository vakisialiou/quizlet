import { getInitialState } from '@store/initial-state'
import { getSettings } from '@repositories/settings'
import { AppProvider } from '@app/provider'
import localFont from 'next/font/local'
import type { Metadata } from 'next'
import { auth } from '@auth'
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
  const session = await auth()
  const settings = await getSettings(session?.user?.id || '')
  const initialState = await getInitialState({ session, settings })

  return (
    <html lang="en">
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
