import { createRelationTerms } from '@repositories/relation-term'
import { getModuleShareById } from '@repositories/module-share'
import { createTerm, updateTerm } from '@repositories/terms'
import { RelationTermData } from '@entities/RelationTerm'
import { ModuleShareEnum } from '@entities/ModuleShare'
import { prisma, transaction } from '@lib/prisma'
import { TermData } from '@entities/Term'
import {auth} from '@auth'

async function getUserId(shareId: string | null, moduleId: string | null) {
  if (shareId) {
    const share = await getModuleShareById(prisma, shareId)
    if (!share) {
      return null
    }

    if (share.access !== ModuleShareEnum.editable) {
      return null
    }

    if (share.moduleId !== moduleId) {
      return null
    }

    return share.ownerId
  }

  const session = await auth()
  return session?.user?.id || null
}

export async function PUT(req: Request) {
  const body = await req.json()
  if (body.relationTerm.termId !== body.term.id) {
    return new Response(null, { status: 400 })
  }

  const userId = await getUserId(body.shareId || null, body.relationTerm.moduleId || null)
  if (!userId) {
    return new Response(null, { status: 401 })
  }

  try {
    await transaction(prisma, async (entry) => {
      await createTerm(entry, body.term as TermData)
      await createRelationTerms(entry, userId, body.relationTerm as RelationTermData)
    })
    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  if (body.relationTerm.termId !== body.term.id) {
    return new Response(null, { status: 400 })
  }

  const userId = await getUserId(body.shareId || null, body.relationTerm.moduleId || null)
  if (!userId) {
    return new Response(null, { status: 401 })
  }

  try {
    await updateTerm(prisma, body.term as TermData)
    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}

