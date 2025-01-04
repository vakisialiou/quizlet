import { findRelationTermsByUserId } from '@repositories/relation-term'
import { findFoldersByUserId } from '@repositories/folders'
import { findModulesByUserId } from '@repositories/modules'
import { findTermsByUserId } from '@repositories/terms'
import ProviderStore from '@app/[locale]/provider-store'
import { getInitialState } from '@store/initial-state'
import { getSettings } from '@repositories/settings'
import { prisma } from '@lib/prisma'
import { auth } from '@auth'
import React from 'react'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  const userId = session?.user?.id || ''
  const settings = userId ? await getSettings(prisma, userId) : null
  const folders = userId ? await findFoldersByUserId(prisma, userId) : []
  const modules = userId ? await findModulesByUserId(prisma, userId) : []

  const relationTerms = userId ? await findRelationTermsByUserId(prisma, userId) : []
  const terms = userId ? await findTermsByUserId(prisma, userId) : []

  const initialState = await getInitialState({ session, settings, folders, modules, terms, relationTerms })

  return (
    <ProviderStore initialState={initialState}>
      {children}
    </ProviderStore>
  )
}
