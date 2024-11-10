import { createPreloadedSimulatorsState } from '@store/reducers/simulators'
import { createPreloadedFoldersState } from '@store/reducers/folders'
import { createPreloadedTermsState } from '@store/reducers/terms'
import { findFoldersByUserId } from '@repositories/folders'
import { findTermsByUserId } from '@repositories/terms'
import ReduxProvider from './provider'
import { auth } from '@auth'
import React from 'react'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth()
  const folders = await findFoldersByUserId(session?.user?.id as string)
  const terms = await findTermsByUserId(session?.user?.id as string)

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
