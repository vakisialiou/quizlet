'use client'

import { ShareConfigType } from '@store/initial-state-share'
import { createShareStore } from '@store/store'
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'

export default function ProviderStore({ children, initialState }: { children: ReactNode, initialState: ShareConfigType }) {
  const store = createShareStore(initialState)

  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}
