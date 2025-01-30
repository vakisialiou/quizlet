import { createRelationTerms, updateRelationTerms, removeRelationTerms } from '@repositories/relation-term'
import { RelationTermData } from '@entities/RelationTerm'
import { prisma } from '@lib/prisma'
import { auth } from '@auth'

export async function POST(req: Request) {
  const session = await auth()
  const userId = session?.user?.id || null

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const body = await req.json()

  try {
    await createRelationTerms(prisma, userId, body.relation as RelationTermData)
    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await auth()
  const userId = session?.user?.id || null

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const body = await req.json()

  try {
    await updateRelationTerms(prisma, userId, body.relation as RelationTermData)
    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await auth()
  const userId = session?.user?.id || null

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const body = await req.json()

  try {
    await removeRelationTerms(prisma, userId, body.relation.id as string)
    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}

