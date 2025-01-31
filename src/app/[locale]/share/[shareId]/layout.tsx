import { findModuleRelationTerms } from '@repositories/relation-term'
import { getModuleShareById } from '@repositories/module-share'
import { getInitialState } from '@store/initial-state-share'
import { findTermsByModuleId } from '@repositories/terms'
import { getModuleById } from '@repositories/modules'
import ProviderStore from './provider-store'
import { notFound } from 'next/navigation'
import { prisma } from '@lib/prisma'
import { ReactNode } from 'react'

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

  const [ terms, module, relationTerms ] = await Promise.all([
    findTermsByModuleId(prisma, share.moduleId),
    getModuleById(prisma, share.ownerId, share.moduleId),
    findModuleRelationTerms(prisma, share.moduleId)
  ])

  const initialState = await getInitialState({ share, terms, module, relationTerms })

  return (
    <ProviderStore initialState={initialState}>
      {children}
    </ProviderStore>
  )
}
