import { upsertFolder, removeFolder } from '@repositories/folders'
import { FolderData } from '@entities/Folder'
import { NextRequest } from 'next/server'
import { prisma } from '@lib/prisma'
import { auth } from '@auth'

export async function PUT(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const folder = await req.json()
  await upsertFolder(prisma, userId, folder as FolderData)

  return new Response(null, { status: 200 })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ folderId: string }> }) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const { folderId } = await params

  await removeFolder(prisma, userId, folderId)

  return new Response(null, { status: 200 })
}
