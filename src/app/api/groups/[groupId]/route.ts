import { removeFolderGroupById, upsertFolderGroup } from '@repositories/folder-group'
import { removeRelationFoldersByGroupId } from '@repositories/relation-folder'
import { FolderGroupData } from '@entities/FolderGroup'
import { prisma, transaction } from '@lib/prisma'
import { NextRequest } from 'next/server'
import { auth } from '@auth'

export async function PUT(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id as string
  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const group = await req.json()
  await upsertFolderGroup(prisma, userId, group as FolderGroupData)
  return new Response(null, { status: 200 })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const { groupId } = await params

  await transaction(prisma, async (entry) => {
    await removeRelationFoldersByGroupId(entry, userId, groupId)
    await removeFolderGroupById(entry, userId, groupId)
  })

  return new Response(null, { status: 200 })
}
