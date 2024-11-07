'use client'

import { DataStateSimulatorsType } from '@store/reducers/simulators'
import { DataStateFoldersType } from '@store/reducers/folders'
import { DataStateTermsType } from '@store/reducers/terms'
import { initializeStore } from '@store/index'
import { Provider } from 'react-redux'
import { ReactNode } from 'react'

export default function ReduxProvider(
  { children, preloadedState }:
  {
    children: ReactNode,
    preloadedState: {
      terms: DataStateTermsType,
      folders: DataStateFoldersType,
      simulators: DataStateSimulatorsType
    }
  }
) {
  const store = initializeStore(preloadedState)
  return (
    <Provider
      store={store}
    >
      {children}
    </Provider>
  )
}
