import { createRelationFolder, removeRelationFolder } from '@repositories/relation-folder'
import { RelationFolderData } from '@entities/RelationFolder'
import { NextRequest } from 'next/server'
import { prisma } from '@lib/prisma'
import { auth } from '@auth'

export async function PUT(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const { relation } = await req.json()
  await createRelationFolder(prisma, userId, relation as RelationFolderData)

  return new Response(null, { status: 200 })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const { relation } = await req.json()
  await removeRelationFolder(prisma, userId, relation.id)

  return new Response(null, { status: 200 })
}
