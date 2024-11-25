'use client'

import { SessionProvider } from 'next-auth/react'
import { ConfigType } from '@store/initial-state'
import { presetStore } from '@store/index'
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'

export function AppProvider({ children, initialState }: { children: ReactNode, initialState: ConfigType }) {
  const store = presetStore(initialState)

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
