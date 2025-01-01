
import ClientFolderShare, { ClientFolderShareEnum } from '@entities/ClientFolderShare'
import { upsertFolderShare } from '@repositories/folder-share'
import { NextRequest } from 'next/server'
import { prisma } from '@lib/prisma'
import { auth } from '@auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ folderId: string }> }) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const url = new URL(req.url)
  let access = url.searchParams.get('access') as ClientFolderShareEnum
  const isValid = Object.values(ClientFolderShareEnum).includes(access)
  if (!isValid) {
    access = ClientFolderShareEnum.readonly
  }

  const { folderId } = await params

  try {
    const share = new ClientFolderShare(userId, folderId)
      .setAccess(access)

    const shareId = await upsertFolderShare(prisma, share)
    return new Response(JSON.stringify({ shareId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (e) {
    console.log(e)
    return new Response(null, { status: 500 })
  }
}
