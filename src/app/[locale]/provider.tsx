'use client'

import React, { ReactNode, useLayoutEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ConfigType } from '@store/initial-state'
import { presetStore } from '@store/index'
import { Provider } from 'react-redux'

export function AppProvider({ children, initialState }: { children: ReactNode, initialState: ConfigType }) {
  const store = presetStore(initialState)

  useLayoutEffect(() => {
    const updateHeight = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)

    return () => {
      window.removeEventListener('resize', updateHeight)
    }
  }, [])

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
