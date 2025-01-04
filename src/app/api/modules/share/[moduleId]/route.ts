import ModuleShare, { ModuleShareEnum } from '@entities/ModuleShare'
import { upsertModuleShare } from '@repositories/module-share'
import { NextRequest } from 'next/server'
import { prisma } from '@lib/prisma'
import { auth } from '@auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ moduleId: string }> }) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const url = new URL(req.url)
  let access = url.searchParams.get('access') as ModuleShareEnum
  const isValid = Object.values(ModuleShareEnum).includes(access)
  if (!isValid) {
    access = ModuleShareEnum.readonly
  }

  const { moduleId } = await params

  try {
    const share = new ModuleShare()
      .setAccess(access)
      .setOwnerId(userId)
      .setModuleId(moduleId)
      .serialize()

    const shareId = await upsertModuleShare(prisma, userId, share)
    return new Response(JSON.stringify({ shareId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch {
    return new Response(null, { status: 500 })
  }
}
