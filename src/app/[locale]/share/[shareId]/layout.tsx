import { getModuleShareById } from '@repositories/module-share'
import { getFolderById } from '@repositories/folders'
import { notFound } from 'next/navigation'
import { prisma } from '@lib/prisma'
import { ReactNode } from 'react'
import { auth } from '@auth'

import { getModuleById } from '@repositories/modules'

export default async function Layout(
  {
    children,
    params
  }: Readonly<{
    children: ReactNode,
    params: Promise<{ shareId: string }>
  }>
) {
  const { shareId } = await params

  const share = await getModuleShareById(prisma, shareId)
  if (!share) {
    return notFound()
  }

  const session = await auth()
  const userId = session?.user?.id || ''
  const course = share.ownerId !== userId ? await getModuleById(prisma, share.ownerId, share.moduleId) : null

  if (!course && share.ownerId !== userId) {
    return notFound()
  }

  return (
    <>
      {children}
    </>
  )
}
