'use client'

import { ConfigType } from '@store/initial-state'
import { presetStore } from '@store/index'
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'

export default function ProviderStore({ children, initialState }: { children: ReactNode, initialState: ConfigType }) {
  const store = presetStore(initialState)

  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}
