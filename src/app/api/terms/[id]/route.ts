import { getModuleShareById } from '@repositories/module-share'
import { ModuleShareEnum } from '@entities/ModuleShare'
import { upsertTerm } from '@repositories/terms'
import { TermData } from '@entities/Term'
import { prisma } from '@lib/prisma'
import {auth} from '@auth'

async function getUserId(shareId: string | null) {
  if (shareId) {
    const share = await getModuleShareById(prisma, shareId)
    if (!share) {
      return null
    }

    if (share.access !== ModuleShareEnum.editable) {
      return null
    }

    return share.ownerId
  }

  const session = await auth()
  return session?.user?.id || null
}

export async function PUT(req: Request) {
  const body = await req.json()

  const userId = await getUserId(body.shareId)
  if (!userId) {
    return new Response(null, { status: 401 })
  }

  try {
    await upsertTerm(prisma, userId, body.term as TermData)
    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}

