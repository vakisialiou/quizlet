'use client'

import { DataStateType } from '@store/reducers/folders'
import { initializeStore } from '@store/index'
import { Provider } from 'react-redux'
import { ReactNode } from 'react'

export default function ReduxProvider(
  { children, preloadedState }:
  {
    children: ReactNode,
    preloadedState: {
      folders: DataStateType
    }
  }
) {
  const store = initializeStore(preloadedState)
  return (
    <Provider store={store}>{children}</Provider>
  )
}
