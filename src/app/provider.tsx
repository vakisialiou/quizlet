'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import { EnhancedStore } from '@reduxjs/toolkit'
import { presetStore } from '@store/index'
import { Provider } from 'react-redux'

export function AppProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<EnhancedStore | null>(null)
  useEffect(() => {
    presetStore().then(setStore)
  }, [])

  if (!store) {
    return <div>Loading...</div>
  }

  return (
    <SessionProvider>
      <Provider
        store={store}
      >
        {children}
      </Provider>
    </SessionProvider>
  )
}
