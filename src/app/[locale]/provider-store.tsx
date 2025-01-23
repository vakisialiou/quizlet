'use client'

import { ConfigType } from '@store/initial-state-main'
import { createMainStore } from '@store/store'
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'

export default function ProviderStore({ children, initialState }: { children: ReactNode, initialState: ConfigType }) {
  const store = createMainStore(initialState)

  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}
