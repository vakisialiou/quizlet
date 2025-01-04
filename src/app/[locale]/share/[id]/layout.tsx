import { findFoldersByUserId, getFolderById } from '@repositories/folders'
import { getFolderShareById } from '@repositories/folder-share'
import ProviderStore from '@app/[locale]/provider-store'
import { getInitialState } from '@store/initial-state'
import { getSettings } from '@repositories/settings'
import { notFound } from 'next/navigation'
import { prisma } from '@lib/prisma'
import { ReactNode } from 'react'
import { auth } from '@auth'

export default async function Layout(
  {
    children,
    params
  }: Readonly<{
    children: ReactNode,
    params: Promise<{ id: string }>
  }>
) {
  const { id } = await params

  const share = await getFolderShareById(prisma, id)
  if (!share) {
    return notFound()
  }


  const session = await auth()
  const userId = session?.user?.id || ''
  const folder = share.ownerUserId !== userId ? await getFolderById(prisma, share.ownerUserId, share.folderId) : null

  if (!folder && share.ownerUserId !== userId) {
    return notFound()
  }

  const settings = userId ? await getSettings(prisma, userId) : null
  const folders = userId ? await findFoldersByUserId(prisma, userId) : []
  const initialState = await getInitialState({
    session,
    settings,
    folders: folder ? [ ...folders, folder ] : folders,
    share
  })

  return (
    <ProviderStore initialState={initialState}>
      {children}
    </ProviderStore>
  )
}
