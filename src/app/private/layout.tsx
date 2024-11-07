import { createPreloadedSimulatorsState } from '@store/reducers/simulators'
import { createPreloadedFoldersState } from '@store/reducers/folders'
import { createPreloadedTermsState } from '@store/reducers/terms'
import { findFoldersByUserId } from '@repositories/folders'
import { findTermsByUserId } from '@repositories/terms'
import Header from '@containers/Header'
import ReduxProvider from './provider'
import React from 'react'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const folders = await findFoldersByUserId(1)
  const terms = await findTermsByUserId(1)

  return (
    <ReduxProvider
      preloadedState={{
        terms: createPreloadedTermsState(terms),
        folders: createPreloadedFoldersState(folders),
        simulators: createPreloadedSimulatorsState({})
      }}
    >
      {children}
    </ReduxProvider>
  )
}
