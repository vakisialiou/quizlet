import { removeFolder, upsertFolder, getFolderById } from '@repositories/folders'
import { deleteFolderGroupById } from '@repositories/folder-group'
import { RelationFolderData } from '@entities/RelationFolder'
import { prisma, transaction } from '@lib/prisma'
import { FolderData } from '@entities/Folder'
import { NextRequest } from 'next/server'
import { auth } from '@auth'

export async function PUT(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  try {
    const folder = await req.json()

    await upsertFolder(prisma, userId, folder as FolderData)

    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ folderId: string }> }) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const { folderId } = await params

  const folder = await getFolderById(prisma, userId, folderId)

  if (!folder) {
    return new Response(null, { status: 401 })
  }

  const relation = await req.json() as RelationFolderData

  try {
    await transaction(prisma, async (entry) => {
      await removeFolder(prisma, userId, folderId)
      if (relation.groupId) {
        await deleteFolderGroupById(entry, userId, relation.groupId)
      }
    })

    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}
